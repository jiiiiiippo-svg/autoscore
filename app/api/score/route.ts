import { NextResponse } from "next/server";
import { calculateAutoscore } from "@/lib/scoring";
import { fetchComparables } from "@/lib/supabase";

function median(values: number[]) {
  const clean = values
    .map(Number)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (clean.length === 0) {
    return null;
  }

  const middle = Math.floor(clean.length / 2);

  if (clean.length % 2 === 0) {
    return Math.round((clean[middle - 1] + clean[middle]) / 2);
  }

  return Math.round(clean[middle]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const brand = String(body.brand || "");
    const model = String(body.model || "");
    const year = Number(body.year);
    const mileage = Number(body.mileage);
    const askingPrice = Number(body.askingPrice);

    let comparablePrices: number[] = [];

    try {
      const comparables = await fetchComparables({
        brand,
        model,
        year,
        mileage,
      });

      comparablePrices = comparables.map((item) => Number(item.price));
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
      description: "",
      comparablePrices,
    });

    const realMarketPrice = median(comparablePrices);

    return NextResponse.json({
      ...result,
      marketPrice: realMarketPrice || result.marketPrice,
      marketPriceSource:
        realMarketPrice && comparablePrices.length > 0
          ? `Prix basé sur ${comparablePrices.length} annonces comparables Autoscore`
          : result.marketPriceSource,
      priceSamplesUsed: comparablePrices.length || result.priceSamplesUsed,
    });
  } catch (error) {
    console.error("Score API error:", error);

    return NextResponse.json(
      { error: "Impossible de calculer le score." },
      { status: 400 }
    );
  }
}
