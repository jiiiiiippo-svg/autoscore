export type CarInput = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  askingPrice: number;
  saleTiming?: string;
  description?: string;
  comparablePrices?: number[];
};

export type ScoreResult = {
  score: number;
  marketPrice: number;
  marketPriceSource: string;
  priceSamplesUsed: number;
  discountPercent: number;
  recommendedPriceMin: number;
  recommendedPriceMax: number;
  reasons: string[];
  warnings: string[];
  suggestion?: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function modelBoost(model: string) {
  const m = normalize(model);
  if (["m4", "m3", "rs3", "rs4", "amg", "gti"].some((x) => m.includes(x))) return 1.35;
  if (["320", "a4", "golf", "c220", "a3"].some((x) => m.includes(x))) return 1.1;
  return 1;
}

export function estimateMarketPrice(car: CarInput): number {
  const brand = normalize(car.brand);

  const baseValues: Record<string, number> = {
    bmw: 45000,
    audi: 40000,
    mercedes: 42000,
    volkswagen: 25000,
    vw: 25000,
    toyota: 22000,
    peugeot: 18000,
    renault: 17000,
    ford: 18000,
    opel: 16000,
  };

  const base = (baseValues[brand] ?? 20000) * modelBoost(car.model);
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - car.year);

  const agePenalty = age * 1800;
  const mileagePenalty = Math.max(0, car.mileage - 30000) * 0.08;
  const estimated = base - agePenalty - mileagePenalty;

  return Math.max(3000, Math.round(estimated / 100) * 100);
}

function priceScore(discountPercent: number) {
  // discountPercent positif = prix sous le marché
  // discountPercent négatif = prix au-dessus du marché

  if (discountPercent <= -80) {
    return {
      points: -2,
      reason: "Prix extrêmement au-dessus du marché",
      warning: "Le prix demandé est très éloigné du marché. Le score est fortement pénalisé.",
    };
  }

  if (discountPercent <= -50) {
    return {
      points: -1.2,
      reason: "Prix très fortement au-dessus du marché",
      warning: "Le prix demandé risque de bloquer presque toutes les demandes.",
    };
  }

  if (discountPercent <= -30) {
    return {
      points: -0.5,
      reason: "Prix fortement au-dessus du marché",
      warning: "Un ajustement important du prix est recommandé.",
    };
  }

  if (discountPercent <= -15) {
    return {
      points: 0,
      reason: "Prix nettement au-dessus du marché",
      warning: "Le prix demandé risque de limiter fortement les demandes.",
    };
  }

  if (discountPercent <= -5) {
    return {
      points: 1,
      reason: "Prix légèrement au-dessus du marché",
      warning: "Un ajustement du prix pourrait améliorer le score.",
    };
  }

  if (discountPercent < 5) {
    return {
      points: 2,
      reason: "Prix aligné avec le marché",
    };
  }

  if (discountPercent < 15) {
    return {
      points: 3,
      reason: "Prix attractif par rapport au marché",
    };
  }

  if (discountPercent < 30) {
    return {
      points: 4,
      reason: "Très bon prix par rapport au marché",
    };
  }

  if (discountPercent < 50) {
    return {
      points: 3.2,
      reason: "Prix très bas, opportunité forte mais à vérifier",
      warning: "Le prix est très inférieur au marché. Vérifiez l’état du véhicule, l’historique et la raison de la vente.",
    };
  }

  if (discountPercent < 70) {
    return {
      points: 2.2,
      reason: "Prix anormalement bas",
      warning: "Le prix est anormalement bas. Il peut y avoir un problème caché ou une information manquante.",
    };
  }

  return {
    points: 1.2,
    reason: "Prix beaucoup trop bas pour être fiable",
    warning: "Le prix est beaucoup trop éloigné du marché. L’annonce doit être vérifiée avant publication.",
  };
}

function demandScore(car: CarInput) {
  const brand = normalize(car.brand);
  const highDemandBrands = ["bmw", "audi", "mercedes", "volkswagen", "vw", "toyota"];

  if (highDemandBrands.includes(brand)) {
    return { points: 2, reason: "Marque recherchée sur le marché" };
  }

  return { points: 1, reason: "Demande correcte sur le marché" };
}

function urgencyScore(car: CarInput) {
  const timing = normalize(car.saleTiming || "");
  const text = normalize(car.description || "");

  let timingPoints = 0.5;
  let timingReason = "Vendeur sans urgence particulière";

  if (timing === "immediate") {
    timingPoints = 2;
    timingReason = "Vente immédiate souhaitée";
  }

  if (timing === "1-3") {
    timingPoints = 1.3;
    timingReason = "Vente souhaitée sous 1 à 3 mois";
  }

  if (timing === "3-6") {
    timingPoints = 0.6;
    timingReason = "Vente prévue sous 3 à 6 mois";
  }

  const signals = [
    "urgent",
    "rapidement",
    "prix négociable",
    "négociable",
    "départ",
    "déménagement",
    "a discuter",
    "à discuter",
  ];

  const hasSignal = signals.some((signal) => text.includes(signal));

  if (hasSignal && timingPoints < 2) {
    return {
      points: Math.min(2, timingPoints + 0.5),
      reason: `${timingReason} avec signaux de motivation détectés`,
    };
  }

  return {
    points: timingPoints,
    reason: timingReason,
  };
}

function liquidityScore(car: CarInput) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;

  if (age <= 8 && car.mileage <= 140000) return { points: 2, reason: "Véhicule facile à revendre" };
  if (age <= 12 && car.mileage <= 190000) return { points: 1, reason: "Liquidité correcte" };

  return { points: 0.5, reason: "Revente potentiellement plus lente" };
}

// realMarketPrice: optional median from Supabase — overrides algo estimate when available
export function calculateAutoscore(car: CarInput, realMarketPrice?: number): ScoreResult {
  const marketPrice = realMarketPrice ?? estimateMarketPrice(car);
  const discountPercent = ((marketPrice - car.askingPrice) / marketPrice) * 100;

  const price = priceScore(discountPercent);
  const demand = demandScore(car);
  const urgency = urgencyScore(car);
  const liquidity = liquidityScore(car);

  const rawScore = price.points + demand.points + urgency.points + liquidity.points;
  const score = Math.min(10, Math.max(0, Math.round(rawScore * 10) / 10));

  const recommendedPriceMin = Math.round((marketPrice * 0.95) / 100) * 100;
  const recommendedPriceMax = Math.round((marketPrice * 1.03) / 100) * 100;
  const warnings = [price.warning].filter(Boolean) as string[];

  let suggestion: string | undefined;

  if (score < 6) {
    suggestion = `Votre prix semble trop élevé. Essayez une fourchette entre ${recommendedPriceMin.toLocaleString(
      "fr-CH"
    )} CHF et ${recommendedPriceMax.toLocaleString("fr-CH")} CHF puis recalculez le score.`;
  }

  return {
    score,
    marketPrice,
    marketPriceSource: "Prix estimé à partir du modèle Autoscore",
    priceSamplesUsed: 0,
    discountPercent: Math.round(discountPercent * 10) / 10,
    recommendedPriceMin,
    recommendedPriceMax,
    reasons: [price.reason, demand.reason, urgency.reason, liquidity.reason],
    warnings,
    suggestion,
  };
}
