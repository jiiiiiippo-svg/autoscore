import { NextResponse } from "next/server";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

function extractPrice(item: any): number | null {
  const value =
    item?.price?.current?.amount ??
    item?.price?.amount ??
    item?.price ??
    null;

  const price = Number(value);

  return Number.isFinite(price) ? price : null;
}

function extractYear(item: any): number | null {
  const firstRegistration = item?.attributes?.["First Registration"];

  if (typeof firstRegistration === "string" && firstRegistration.length >= 4) {
    const year = Number(firstRegistration.slice(0, 4));
    return Number.isFinite(year) ? year : null;
  }

  return null;
}

function extractMileage(item: any): number | null {
  const mileage = item?.attributes?.["Mileage (km)"];
  const parsed = Number(mileage);

  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(req: Request) {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Supabase is not configured yet",
      });
    }

    const body = await req.json();

    const items = Array.isArray(body)
      ? body
      : Array.isArray(body.items)
        ? body.items
        : Array.isArray(body.data)
          ? body.data
          : [];

    if (items.length === 0) {
      return NextResponse.json({
        ok: true,
        inserted: 0,
        reason: "No items received",
      });
    }

    const rows = items
      .map((item: any) => {
        const price = extractPrice(item);

        if (!price) {
          return null;
        }

        return {
          source: "autoscout24",
          external_id: String(item.id || item.url || crypto.randomUUID()),
          brand: item.brand || null,
          model: item.model || null,
          model_version: item.modelVersion || item.title || null,
          year: extractYear(item),
          mileage: extractMileage(item),
          price,
          body_type: item.bodyType || null,
          fuel: item.attributes?.Fuel || null,
          transmission: item.attributes?.Transmission || null,
          power_kw: item.attributes?.["Power (kW)"] || null,
          seller_type: item.dealerDetails?.sellerType || null,
          dealer_name: item.dealerDetails?.name || null,
          url: item.url || null,
          scraped_at: new Date().toISOString(),
        };
      })
      .filter(Boolean);

    if (rows.length === 0) {
      return NextResponse.json({
        ok: true,
        inserted: 0,
        reason: "No valid prices found",
      });
    }

    const { error } = await supabase
      .from("market_listings")
      .upsert(rows, {
        onConflict: "source,external_id",
      });

    if (error) {
      console.error("Apify webhook Supabase error:", error.message);

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      inserted: rows.length,
    });
  } catch (error) {
    console.error("Apify webhook error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "apify webhook",
  });
}
