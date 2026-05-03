import { NextResponse } from "next/server";
import { calculateAutoscore } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { brand, model, year, mileage, askingPrice, description } = body;

    if (!brand || !model || !year || !mileage || !askingPrice) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    const result = calculateAutoscore({
      brand: String(brand),
      model: String(model),
      year: Number(year),
      mileage: Number(mileage),
      askingPrice: Number(askingPrice),
      description: description ? String(description) : "",
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Impossible de calculer le score." },
      { status: 400 }
    );
  }
}
