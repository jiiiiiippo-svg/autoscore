import { NextResponse } from "next/server";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

/**
 * Extrait le prix depuis un item blackfalcondata/autoscout24-scraper.
 * Format: { price: 12500, currency: "EUR" } — prix directement en nombre.
 */
function extractPrice(item: any): number | null {
  // Format blackfalcondata: item.price est un nombre direct
  const price = Number(item?.price ?? null);
  return Number.isFinite(price) && price > 0 ? price : null;
}

/**
 * Extrait l'année depuis firstRegistration.
 * Supporte: "2006-04-01" (avec details), "07-2007" (sans details), "2006"
 */
function extractYear(item: any): number | null {
  const reg = item?.firstRegistration;
  if (typeof reg !== "string") return null;
  // Cherche 4 chiffres consécutifs qui ressemblent à une année (1950–2030)
  const match = reg.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  if (match) return Number(match[1]);
  // Fallback: premiers 4 chars
  const year = Number(reg.slice(0, 4));
  return Number.isFinite(year) && year > 1900 ? year : null;
}

/**
 * Extrait le kilométrage depuis mileageKm (nombre direct).
 */
function extractMileage(item: any): number | null {
  const mileage = item?.mileageKm;
  const parsed = Number(mileage);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

async function fetchDatasetItems(datasetId: string, apifyToken: string): Promise<any[]> {
  const allItems: any[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) break;

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    allItems.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }

  return allItems;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vérification du secret webhook
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && body.secret !== webhookSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (!hasSupabaseConfig || !supabase) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Supabase is not configured yet",
      });
    }

    const apifyToken = process.env.APIFY_TOKEN;
    if (!apifyToken) {
      return NextResponse.json({ error: "APIFY_TOKEN manquant" }, { status: 500 });
    }

    // Récupère les items depuis le dataset Apify
    const datasetId = body.datasetId;
    if (!datasetId) {
      return NextResponse.json({ error: "datasetId manquant" }, { status: 400 });
    }

    const items = await fetchDatasetItems(datasetId, apifyToken);

    if (items.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0, reason: "Dataset vide" });
    }

    const rows = items
      .map((item: any) => {
        const price = extractPrice(item);
        if (!price) return null;

        const year = extractYear(item);
        // Ignore listings sans année valide (contrainte NOT NULL en DB)
        if (!year) return null;

        // Format blackfalcondata/autoscout24-scraper
        return {
          source: "autoscout24",
          external_id: String(item.listingId || item.id || item.url || crypto.randomUUID()),
          brand: item.make || item.brand || null,
          model: item.model || null,
          model_version: item.modelVersion || item.variant || null,
          year,
          mileage: extractMileage(item),
          price,
          body_type: item.bodyType || null,
          fuel: item.fuelType || item.fuel || null,
          transmission: item.transmission || null,
          power_kw: item.powerKw != null ? Number(item.powerKw) : null,
          seller_type: item.sellerType || null,
          dealer_name: item.sellerName || null,
          url: item.url || item.portalUrl || null,
          scraped_at: new Date().toISOString(),
        };
      })
      .filter(Boolean);

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0, reason: "Aucun prix valide" });
    }

    // Upsert par batch de 500
    let totalInserted = 0;
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500);
      const { error } = await supabase
        .from("market_listings")
        .upsert(batch, { onConflict: "source,external_id" });

      if (error) {
        console.error("Supabase upsert error:", error.message);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      totalInserted += batch.length;
    }

    console.log(`Webhook Apify: ${totalInserted} annonces importées depuis dataset ${datasetId}`);

    return NextResponse.json({ ok: true, inserted: totalInserted, datasetId });
  } catch (error) {
    console.error("Apify webhook error:", error);
    return NextResponse.json({ ok: false, error: "Webhook failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "apify webhook" });
}
