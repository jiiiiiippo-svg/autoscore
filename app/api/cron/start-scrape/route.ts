/**
 * GET /api/cron/start-scrape
 *
 * Appelé automatiquement par Vercel Cron le 1er et le 15 du mois à 06h00.
 * Démarre un run Apify (blackfalcondata/autoscout24-scraper) pour DE + AT.
 * Rend la main immédiatement — pas de timeout.
 *
 * Note: AutoScout24.ch bloque les scrapers. On utilise les données européennes
 * (DE + AT) comme référence de marché — prix comparables à la Suisse.
 */

import { NextResponse } from "next/server";

// Actor Apify qui supporte vraiment autoscout24.com (Playwright + proxies résidentiels)
// Marchés supportés : DE, AT, BE, FR, IT, NL, ES, LU
const ACTOR_ID = "blackfalcondata~autoscout24-scraper";

// Pays européens utilisés comme référence de prix (proche du marché suisse)
const TARGET_COUNTRIES = ["DE", "AT"];

export async function GET(req: Request) {
  // Sécurité : Vercel envoie le header Authorization avec le cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apifyToken = process.env.APIFY_TOKEN;
  if (!apifyToken) {
    return NextResponse.json({ error: "APIFY_TOKEN manquant" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://autoscorev2.vercel.app";
  const webhookUrl = `${appUrl}/api/webhooks/apify`;

  // Démarre le run Apify avec webhook configuré
  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${apifyToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Paramètres natifs du blackfalcondata actor
        countries: TARGET_COUNTRIES,
        maxResults: 2000,
        includeDetails: true,
        // Webhook Apify → appelé automatiquement quand le run est terminé
        webhooks: [
          {
            eventTypes: ["ACTOR.RUN.SUCCEEDED"],
            requestUrl: webhookUrl,
            payloadTemplate: JSON.stringify({
              runId: "{{runId}}",
              datasetId: "{{defaultDatasetId}}",
              secret: process.env.WEBHOOK_SECRET,
            }),
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Apify start error:", err);
    return NextResponse.json({ error: "Apify start failed", detail: err }, { status: 500 });
  }

  const { data } = await res.json();
  console.log(`Scrape démarré — Run ID: ${data.id}, pays: ${TARGET_COUNTRIES.join("+")}`);

  return NextResponse.json({
    ok: true,
    runId: data.id,
    countries: TARGET_COUNTRIES,
    message: `Scrape démarré sur ${TARGET_COUNTRIES.join(", ")}. Import automatique via webhook à la fin.`,
  });
}
