import { NextResponse } from "next/server";
import { calculateAutoscore } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = calculateAutoscore({
      brand: String(body.brand || ""),
      model: String(body.model || ""),
      year: Number(body.year),
      mileage: Number(body.mileage),
      askingPrice: Number(body.askingPrice),
      description: String(body.description || ""),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Score API error:", error);

    return NextResponse.json(
      { error: "Impossible de calculer le score." },
      { status: 400 }
    );
  }
}
