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

const BRAND_BASE_VALUE: Record<string, number> = {
  bmw: 15000,
  audi: 15000,
  mercedes: 16000,
  volkswagen: 12000,
  vw: 12000,
  toyota: 11000,
  honda: 10000,
  peugeot: 8500,
  renault: 8000,
  ford: 8500,
  opel: 7500,
  seat: 8000,
  skoda: 9000,
  hyundai: 9500,
  kia: 9500,
  volvo: 13000,
  porsche: 35000,
  tesla: 28000,
  mini: 12000,
  fiat: 7500,
  citroen: 7500,
  mazda: 10000,
  nissan: 9000,
  subaru: 10000,
  mitsubishi: 8000,
};

// Boost for high-demand models
const MODEL_BOOST: Record<string, number> = {
  m3: 8000,
  m4: 8000,
  m5: 10000,
  "330i": 2000,
  "320i": 1500,
  rs3: 7000,
  rs4: 8000,
  rs6: 12000,
  "s3": 4000,
  "s4": 5000,
  gti: 4000,
  golfr: 6000,
  "golf r": 6000,
  amg: 8000,
  "c63": 9000,
  "e63": 11000,
  "911": 15000,
  cayman: 10000,
  supra: 8000,
  mx5: 4000,
  "type r": 6000,
};

const DEMAND_BRANDS = [
  "bmw",
  "audi",
  "mercedes",
  "volkswagen",
  "vw",
  "toyota",
  "volvo",
  "porsche",
  "tesla",
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function estimateMarketPrice(car: CarInput): number {
  const brand = normalize(car.brand);
  const model = normalize(car.model);
  const base = BRAND_BASE_VALUE[brand] ?? 10000;

  // Check for model boost
  let modelBonus = 0;
  for (const [key, bonus] of Object.entries(MODEL_BOOST)) {
    if (model.includes(key)) {
      modelBonus = Math.max(modelBonus, bonus);
    }
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - car.year);

  const agePenalty = age * 650;
  const mileagePenalty = Math.max(0, car.mileage - 60000) * 0.045;

  const estimated = base + modelBonus - agePenalty - mileagePenalty;

  return Math.max(2500, Math.round(estimated / 100) * 100);
}

function priceScore(discountPercent: number): {
  points: number;
  reason: string;
  warning?: string;
} {
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
      points: 3.3,
      reason: "Prix attractif par rapport au marché",
    };
  }

  if (discountPercent < 25) {
    return {
      points: 4,
      reason: "Très bon prix par rapport au marché",
    };
  }

  return {
    points: 3.5,
    reason: "Prix très bas, opportunité forte mais à vérifier",
    warning:
      "Un prix très bas peut signaler un problème caché ou une vente urgente.",
  };
}

function demandScore(car: CarInput): { points: number; reason: string } {
  const brand = normalize(car.brand);

  if (DEMAND_BRANDS.includes(brand)) {
    return { points: 2, reason: "Modèle d'une marque recherchée" };
  }

  return { points: 1, reason: "Demande correcte sur le marché" };
}

function urgencyScore(description = ""): { points: number; reason: string } {
  const text = normalize(description);

  const strongSignals = [
    "urgent",
    "rapidement",
    "départ",
    "demenagement",
    "déménagement",
    "prix négociable",
    "a discuter",
    "à discuter",
    "vente rapide",
    "partir vite",
    "besoin urgent",
  ];
  const hasStrongSignal = strongSignals.some((word) => text.includes(word));

  if (hasStrongSignal) {
    return { points: 2, reason: "Signaux de vendeur motivé détectés" };
  }

  if (text.length > 40) {
    return {
      points: 1,
      reason: "Description suffisante pour qualifier l'annonce",
    };
  }

  return {
    points: 0.5,
    reason: "Peu d'indications sur la motivation du vendeur",
  };
}

function liquidityScore(car: CarInput): { points: number; reason: string } {
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;

  if (age <= 8 && car.mileage <= 140000) {
    return { points: 2, reason: "Véhicule facile à revendre" };
  }

  if (age <= 12 && car.mileage <= 190000) {
    return { points: 1, reason: "Liquidité correcte" };
  }

  return { points: 0.5, reason: "Revente potentiellement plus lente" };
}

export function calculateAutoscore(car: CarInput): ScoreResult {
  const marketPrice = estimateMarketPrice(car);

  const discountPercent =
    ((marketPrice - car.askingPrice) / marketPrice) * 100;

  const price = priceScore(discountPercent);
  const demand = demandScore(car);
  const urgency = urgencyScore(car.description);
  const liquidity = liquidityScore(car);

  const rawScore =
    price.points + demand.points + urgency.points + liquidity.points;
  const score = Math.min(10, Math.max(0, Math.round(rawScore * 10) / 10));

  const recommendedPriceMin =
    Math.round((marketPrice * 0.95) / 100) * 100;
  const recommendedPriceMax =
    Math.round((marketPrice * 1.03) / 100) * 100;

  const warnings = [price.warning].filter(Boolean) as string[];

  let suggestion: string | undefined;

  if (score < 6) {
    suggestion = `Votre prix semble trop élevé. Essayez une fourchette entre ${recommendedPriceMin.toLocaleString("fr-CH")} CHF et ${recommendedPriceMax.toLocaleString("fr-CH")} CHF puis recalculez le score.`;
  }

  return {
    score,
    marketPrice,
    discountPercent: Math.round(discountPercent * 10) / 10,
    recommendedPriceMin,
    recommendedPriceMax,
    reasons: [
      price.reason,
      demand.reason,
      urgency.reason,
      liquidity.reason,
    ],
    warnings,
    suggestion,
  };
}
