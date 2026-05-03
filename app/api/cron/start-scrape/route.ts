/**
 * GET /api/cron/start-scrape
 *
 * Appelé automatiquement par Vercel Cron le 1er et le 15 du mois à 06h00.
 * Démarre un run Apify et configure un webhook pour l'import automatique.
 * Scrape TOUTES les marques disponibles sur AutoScout24.ch (pas de filtre modèle).
 * Rend la main immédiatement — pas de timeout.
 */

import { NextResponse } from "next/server";
import { buildAllBrandUrls, TOTAL_BRANDS } from "@/config/brands";

const ACTOR_ID = "3x1t/autoscout24-ch-scraper";

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
        startUrls: buildAllBrandUrls(),
        maxItemsPerSearch: 200,
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
  console.log(`Scrape démarré — Run ID: ${data.id}, ${TOTAL_BRANDS} marques`);

  return NextResponse.json({
    ok: true,
    runId: data.id,
    brands: TOTAL_BRANDS,
    message: `Scrape démarré sur ${TOTAL_BRANDS} marques. Import automatique via webhook à la fin.`,
  });
}
