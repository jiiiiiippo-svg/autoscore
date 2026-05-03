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

function cleanComparablePrices(values: number[]) {
  return values
    .map(Number)
    .filter((value) => Number.isFinite(value))
    .filter((value) => value >= 1000 && value <= 500000);
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length === 0) return null;

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return Math.round(sorted[middle]);
}

function removeOutliers(values: number[]) {
  if (values.length < 5) return values;

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  const min = q1 - iqr * 1.5;
  const max = q3 + iqr * 1.5;

  return sorted.filter((value) => value >= min && value <= max);
}

function fallbackMarketPrice(car: CarInput) {
  const brand = normalize(car.brand);
  const model = normalize(car.model);

  const brandBaseValues: Record<string, number> = {
    bmw: 42000,
    audi: 40000,
    mercedes: 42000,
    "mercedes-benz": 42000,
    volkswagen: 26000,
    vw: 26000,
    toyota: 24000,
    peugeot: 19000,
    renault: 18000,
    ford: 19000,
    opel: 17000,
    porsche: 85000,
    tesla: 48000,
    ferrari: 180000,
    lamborghini: 220000,
    maserati: 75000,
  };

  const modelBaseValues: Record<string, number> = {
    "bmw:m2": 72000,
    "bmw:m3": 98000,
    "bmw:m4": 95000,
    "bmw:m5": 125000,
    "bmw:m8": 145000,
    "bmw:serie 1": 28000,
    "bmw:serie 2": 35000,
    "bmw:serie 3": 45000,
    "bmw:serie 4": 52000,
    "bmw:serie 5": 65000,
    "bmw:serie 7": 95000,
    "bmw:x1": 38000,
    "bmw:x3": 56000,
    "bmw:x5": 85000,
    "bmw:x6": 95000,
    "bmw:x7": 115000,
    "audi:rs3": 76000,
    "audi:rs4": 95000,
    "audi:rs5": 98000,
    "audi:rs6": 135000,
    "audi:rs7": 145000,
    "audi:r8": 170000,
    "porsche:911": 155000,
    "porsche:macan": 78000,
    "porsche:cayenne": 105000,
    "tesla:model 3": 42000,
    "tesla:model y": 50000,
    "tesla:model s": 85000,
    "tesla:model x": 95000,
    "volkswagen:golf": 28000,
    "volkswagen:golf gti": 42000,
    "volkswagen:golf r": 56000,
  };

  const exactKey = `${brand}:${model}`;
  const base = modelBaseValues[exactKey] ?? brandBaseValues[brand] ?? 22000;

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - car.year);

  const depreciationRate = base >= 90000 ? 0.075 : 0.095;
  const ageMultiplier = Math.pow(1 - depreciationRate, age);

  const mileageFreeAllowance = base >= 90000 ? 20000 : 30000;
  const mileagePenaltyRate = base >= 90000 ? 0.18 : 0.08;
  const mileagePenalty = Math.max(0, car.mileage - mileageFreeAllowance) * mileagePenaltyRate;

  const estimated = base * ageMultiplier - mileagePenalty;

  return Math.max(3000, Math.round(estimated / 100) * 100);
}

export function estimateMarketPrice(car: CarInput) {
  const comparablePrices = removeOutliers(cleanComparablePrices(car.comparablePrices || []));

  if (comparablePrices.length >= 3) {
    const comparableMedian = median(comparablePrices);
    const marketPrice = Math.round(Number(comparableMedian) / 100) * 100;

    return {
      marketPrice,
      source: `Prix basé sur ${comparablePrices.length} annonces comparables Autoscore`,
      samplesUsed: comparablePrices.length,
    };
  }

  return {
    marketPrice: fallbackMarketPrice(car),
    source: "Prix estimé à partir du modèle Autoscore",
    samplesUsed: comparablePrices.length,
  };
}

function priceScore(discountPercent: number) {
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
    return { points: 3, reason: "Prix attractif par rapport au marché" };
  }

  if (discountPercent < 30) {
    return { points: 4, reason: "Très bon prix par rapport au marché" };
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
  const model = normalize(car.model);

  const highDemandBrands = [
    "bmw",
    "audi",
    "mercedes",
    "mercedes-benz",
    "volkswagen",
    "vw",
    "toyota",
    "porsche",
    "tesla",
  ];

  const highDemandModels = [
    "m3",
    "m4",
    "m5",
    "rs3",
    "rs4",
    "rs6",
    "911",
    "golf",
    "golf gti",
    "golf r",
    "model 3",
    "model y",
  ];

  if (highDemandModels.includes(model)) {
    return { points: 2, reason: "Modèle fortement recherché" };
  }

  if (highDemandBrands.includes(brand)) {
    return { points: 1.6, reason: "Marque recherchée sur le marché" };
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
  const age = Math.max(0, currentYear - car.year);

  if (age <= 3 && car.mileage <= 60000) {
    return { points: 2, reason: "Très bonne liquidité à la revente" };
  }

  if (age <= 8 && car.mileage <= 140000) {
    return { points: 1.6, reason: "Véhicule facile à revendre" };
  }

  if (age <= 12 && car.mileage <= 190000) {
    return { points: 1, reason: "Liquidité correcte" };
  }

  return { points: 0.5, reason: "Revente potentiellement plus lente" };
}

export function calculateAutoscore(car: CarInput): ScoreResult {
  const market = estimateMarketPrice(car);
  const marketPrice = market.marketPrice;

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
    marketPriceSource: market.source,
    priceSamplesUsed: market.samplesUsed,
    discountPercent: Math.round(discountPercent * 10) / 10,
    recommendedPriceMin,
    recommendedPriceMax,
    reasons: [price.reason, demand.reason, urgency.reason, liquidity.reason],
    warnings,
    suggestion,
  };
}
