/**
 * Autoscore — Import Apify scraping results into Supabase
 *
 * Usage:
 *   npx tsx scripts/import-apify-to-supabase.ts
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Shape of an Apify AutoScout24 result item ─────────────
interface ApifyItem {
  id?: string | number;
  externalId?: string | number;
  make?: string;
  brand?: string;
  model?: string;
  modelVersion?: string;
  year?: number | string;
  mileage?: number | string;
  price?: number | string;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  powerKw?: number | string;
  sellerType?: string;
  dealerName?: string;
  url?: string;
}

function normalize(item: ApifyItem) {
  return {
    source: "AutoScout24",
    external_id: String(item.externalId ?? item.id ?? ""),
    brand: String(item.make ?? item.brand ?? "").toLowerCase().trim(),
    model: String(item.model ?? "").toLowerCase().trim(),
    model_version: item.modelVersion ?? null,
    year: Number(item.year),
    mileage: Number(item.mileage),
    price: Number(item.price),
    body_type: item.bodyType ?? null,
    fuel: item.fuel ?? null,
    transmission: item.transmission ?? null,
    power_kw: item.powerKw ? Number(item.powerKw) : null,
    seller_type: item.sellerType ?? null,
    dealer_name: item.dealerName ?? null,
    url: item.url ?? null,
    scraped_at: new Date().toISOString().slice(0, 10),
  };
}

async function importItems(rawItems: ApifyItem[]) {
  const items = rawItems
    .map(normalize)
    .filter((i) => i.external_id && i.brand && i.model && i.price > 0);

  if (!items.length) {
    console.log("No valid items to import.");
    return;
  }

  console.log(`Importing ${items.length} listings…`);

  // Upsert: update price/mileage if the listing already exists
  const { data, error } = await supabase
    .from("market_listings")
    .upsert(items, {
      onConflict: "source,external_id",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    console.error("Import error:", error.message);
    process.exit(1);
  }

  console.log(`✅ Imported/updated ${data?.length ?? 0} listings.`);
}

// ── Main — replace with your actual Apify dataset fetch ───
async function main() {
  // Example: fetch from Apify dataset API
  // const res = await fetch(`https://api.apify.com/v2/datasets/${DATASET_ID}/items?token=${APIFY_TOKEN}`);
  // const items: ApifyItem[] = await res.json();

  // For testing, use a small mock sample:
  const mockItems: ApifyItem[] = [
    {
      externalId: "20432997",
      make: "BMW",
      model: "320",
      modelVersion: "320i Touring",
      year: 2011,
      mileage: 94600,
      price: 10700,
      fuel: "Gasoline",
      transmission: "Manual",
      powerKw: 125,
      sellerType: "Dealer",
      dealerName: "DT Cars GmbH",
      url: "https://www.autoscout24.ch/de/d/20432997",
    },
  ];

  await importItems(mockItems);
}

main().catch(console.error);
