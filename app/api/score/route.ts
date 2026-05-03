import { NextResponse } from "next/server";
import { calculateAutoscore } from "@/lib/scoring";
import { fetchComparables, medianPrice } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const brand = String(body.brand || "");
    const model = String(body.model || "");
    const year = Number(body.year);
    const mileage = Number(body.mileage);
    const askingPrice = Number(body.askingPrice);

    let realMarketPrice: number | null = null;
    let comparableCount = 0;

    try {
      const comparables = await fetchComparables({
        brand,
        model,
        year,
        mileage,
      });

      comparableCount = comparables.length;
      realMarketPrice = medianPrice(comparables);
    } catch (dbErr) {
      console.warn("Supabase unavailable, falling back to algo:", dbErr);
    }

    const result = calculateAutoscore({
      brand,
      model,
      year,
      mileage,
      askingPrice,
      saleTiming: String(body.saleTiming || ""),
      description: String(body.description || ""),
      comparablePrices: realMarketPrice ? [realMarketPrice] : [],
    });

    return NextResponse.json({
      ...result,
      marketPrice: realMarketPrice || result.marketPrice,
      marketPriceSource:
        realMarketPrice && comparableCount > 0
          ? `Prix basé sur ${comparableCount} annonces comparables Autoscore`
          : result.marketPriceSource || "Prix estimé à partir du modèle Autoscore",
      priceSamplesUsed: comparableCount || result.priceSamplesUsed || 0,
    });
  } catch (error) {
    console.error("Score API error:", error);

    return NextResponse.json(
      { error: "Impossible de calculer le score." },
      { status: 400 }
    );
  }
}
