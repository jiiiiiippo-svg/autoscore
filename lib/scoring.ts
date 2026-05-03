export type CarInput = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  askingPrice: number;
  description?: string;
};

export type ScoreResult = {
  score: number;
  marketPrice: number;
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
    return { points: 2, reason: "Prix aligné avec le marché" };
  }

  if (discountPercent < 15) {
    return { points: 3.3, reason: "Prix attractif par rapport au marché" };
  }

  if (discountPercent < 25) {
    return { points: 4, reason: "Très bon prix par rapport au marché" };
  }

  return {
    points: 3.5,
    reason: "Prix très bas, opportunité forte mais à vérifier",
    warning: "Un prix très bas peut signaler un problème caché ou une vente urgente.",
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

function urgencyScore(description = "") {
  const text = normalize(description);

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

  if (hasSignal) return { points: 2, reason: "Signaux de vendeur motivé détectés" };
  if (text.length > 40) return { points: 1, reason: "Description suffisante pour qualifier l’annonce" };

  return { points: 0.5, reason: "Peu d’indications sur la motivation du vendeur" };
}

function liquidityScore(car: CarInput) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;

  if (age <= 8 && car.mileage <= 140000) return { points: 2, reason: "Véhicule facile à revendre" };
  if (age <= 12 && car.mileage <= 190000) return { points: 1, reason: "Liquidité correcte" };

  return { points: 0.5, reason: "Revente potentiellement plus lente" };
}

export function calculateAutoscore(car: CarInput): ScoreResult {
  const marketPrice = estimateMarketPrice(car);
  const discountPercent = ((marketPrice - car.askingPrice) / marketPrice) * 100;

  const price = priceScore(discountPercent);
  const demand = demandScore(car);
  const urgency = urgencyScore(car.description);
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
    discountPercent: Math.round(discountPercent * 10) / 10,
    recommendedPriceMin,
    recommendedPriceMax,
    reasons: [price.reason, demand.reason, urgency.reason, liquidity.reason],
    warnings,
    suggestion,
  };
}
