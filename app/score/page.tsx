"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";

type FormState = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  askingPrice: string;
  saleTiming: string;
  generalCondition: string;
  negotiablePrice: string;
};

type ScoreResult = {
  score: number;
  marketPrice: number;
  discountPercent: number;
  recommendedPriceMin: number;
  recommendedPriceMax: number;
  reasons: string[];
  warnings: string[];
  suggestion?: string;
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")
  );
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  return rgbToHex(
    c1.r + (c2.r - c1.r) * factor,
    c1.g + (c2.g - c1.g) * factor,
    c1.b + (c2.b - c1.b) * factor
  );
}

function getScoreColor(score: number) {
  if (score <= 5) {
    return interpolateColor("#ef4444", "#f59e0b", score / 5);
  }

  return interpolateColor("#f59e0b", "#16a34a", (score - 5) / 5);
}

function getScoreLabel(score: number) {
  if (score < 4.5) return "À améliorer";
  if (score < 6.5) return "Correct";
  if (score < 8) return "Bonne occasion";
  return "Excellente occasion";
}

function getScoreMessage(score: number) {
  if (score < 4.5) {
    return "Votre annonce peut être optimisée. Un ajustement du prix peut améliorer fortement votre AutoScore.";
  }

  if (score < 6.5) {
    return "Votre véhicule a du potentiel, mais certains critères peuvent encore être améliorés.";
  }

  if (score < 8) {
    return "Votre véhicule est bien positionné et devrait attirer des acheteurs sérieux.";
  }

  return "Votre véhicule est très bien positionné par rapport au marché.";
}

function formatCHF(value: number) {
  return new Intl.NumberFormat("fr-CH").format(value) + " CHF";
}

const CAR_YEARS = Array.from(
  { length: new Date().getFullYear() - 1980 + 2 },
  (_, index) => String(new Date().getFullYear() + 1 - index)
);

const CAR_MODELS_BY_BRAND: Record<string, string[]> = {
  "Abarth": ["500", "595", "695", "124 Spider"],
  "Alfa Romeo": ["Giulia", "Giulietta", "MiTo", "Stelvio", "Tonale"],
  "Alpina": ["B3", "B4", "B5", "D3", "XB7"],
  "Alpine": ["A110"],
  "Aston Martin": ["DB9", "DB11", "DB12", "DBS", "Vantage", "Vanquish"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "RS3", "RS4", "RS5", "RS6", "RS7", "e-tron", "e-tron GT"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "i5", "i7", "i8", "iX", "M2", "M3", "M4", "M5", "M8"],
  "BYD": ["Atto 3", "Dolphin", "Han", "Seal", "Tang"],
  "Cadillac": ["ATS", "CTS", "Escalade", "SRX", "XT4", "XT5", "XT6"],
  "Chevrolet": ["Aveo", "Camaro", "Captiva", "Corvette", "Cruze", "Spark", "Tahoe", "Trax"],
  "Chrysler": ["300C", "Grand Voyager", "Pacifica", "PT Cruiser", "Voyager"],
  "Citroën": ["C1", "C2", "C3", "C3 Aircross", "C4", "C4 Cactus", "C4 Picasso", "C5", "C5 Aircross", "Berlingo", "Jumpy", "SpaceTourer"],
  "Cupra": ["Ateca", "Born", "Formentor", "Leon", "Tavascan"],
  "Dacia": ["Duster", "Jogger", "Lodgy", "Logan", "Sandero", "Spring"],
  "Daewoo": ["Kalos", "Lacetti", "Matiz", "Nubira"],
  "Daihatsu": ["Cuore", "Materia", "Sirion", "Terios"],
  "Dodge": ["Caliber", "Challenger", "Charger", "Durango", "Journey", "Ram"],
  "DS Automobiles": ["DS 3", "DS 4", "DS 5", "DS 7", "DS 9"],
  "Ferrari": ["458", "488", "812", "California", "F8", "F12", "FF", "Portofino", "Roma", "SF90"],
  "Fiat": ["500", "500C", "500L", "500X", "Bravo", "Doblo", "Ducato", "Grande Punto", "Panda", "Punto", "Tipo"],
  "Ford": ["B-Max", "C-Max", "Edge", "Explorer", "Fiesta", "Focus", "Galaxy", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger", "S-Max", "Transit"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "Honda": ["Accord", "Civic", "CR-V", "CR-Z", "e", "HR-V", "Jazz", "NSX"],
  "Hyundai": ["i10", "i20", "i30", "i40", "Ioniq", "Ioniq 5", "Ioniq 6", "Kona", "Santa Fe", "Tucson", "Veloster"],
  "Infiniti": ["EX", "FX", "Q30", "Q50", "Q60", "Q70", "QX30", "QX50", "QX70"],
  "Isuzu": ["D-Max", "Trooper"],
  "Jaguar": ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ", "XK"],
  "Jeep": ["Cherokee", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  "Kia": ["Carens", "Ceed", "EV6", "EV9", "Niro", "Optima", "Picanto", "ProCeed", "Rio", "Sorento", "Soul", "Sportage", "Stinger", "XCeed"],
  "Lamborghini": ["Aventador", "Gallardo", "Huracan", "Urus"],
  "Lancia": ["Delta", "Musa", "Thema", "Ypsilon"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Lexus": ["CT", "ES", "GS", "IS", "LC", "LS", "NX", "RC", "RX", "UX"],
  "Lotus": ["Elise", "Emira", "Evora", "Exige"],
  "Maserati": ["Ghibli", "GranCabrio", "GranTurismo", "Grecale", "Levante", "Quattroporte"],
  "Mazda": ["2", "3", "5", "6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30", "RX-8"],
  "McLaren": ["570S", "600LT", "650S", "720S", "Artura", "GT", "MP4-12C"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "SLC", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS", "V-Class", "Vito"],
  "MG": ["EHS", "HS", "Marvel R", "MG3", "MG4", "MG5", "ZS"],
  "MINI": ["Cabrio", "Clubman", "Cooper", "Countryman", "Paceman"],
  "Mitsubishi": ["ASX", "Colt", "Eclipse Cross", "L200", "Lancer", "Outlander", "Pajero", "Space Star"],
  "Nissan": ["350Z", "370Z", "Ariya", "Juke", "Leaf", "Micra", "Murano", "Navara", "Note", "Primastar", "Pulsar", "Qashqai", "X-Trail"],
  "Opel": ["Adam", "Antara", "Astra", "Corsa", "Crossland", "Grandland", "Insignia", "Karl", "Meriva", "Mokka", "Vivaro", "Zafira"],
  "Peugeot": ["107", "108", "206", "207", "208", "2008", "307", "308", "3008", "407", "508", "5008", "Partner", "Rifter", "Traveller"],
  "Polestar": ["1", "2", "3", "4"],
  "Porsche": ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Renault": ["Captur", "Clio", "Espace", "Kadjar", "Kangoo", "Koleos", "Laguna", "Megane", "Scenic", "Talisman", "Trafic", "Twingo", "Zoe"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Wraith"],
  "Saab": ["9-3", "9-5"],
  "Seat": ["Alhambra", "Arona", "Ateca", "Ibiza", "Leon", "Mii", "Tarraco", "Toledo"],
  "Škoda": ["Citigo", "Enyaq", "Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Rapid", "Scala", "Superb", "Yeti"],
  "Smart": ["Forfour", "Fortwo", "Roadster"],
  "SsangYong": ["Korando", "Musso", "Rexton", "Tivoli"],
  "Subaru": ["BRZ", "Forester", "Impreza", "Justy", "Legacy", "Levorg", "Outback", "XV"],
  "Suzuki": ["Across", "Alto", "Baleno", "Ignis", "Jimny", "S-Cross", "Swift", "SX4", "Vitara"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Roadster"],
  "Toyota": ["Auris", "Avensis", "Aygo", "C-HR", "Camry", "Corolla", "GT86", "Highlander", "Hilux", "Land Cruiser", "Prius", "Proace", "RAV4", "Supra", "Yaris"],
  "Volkswagen": ["Amarok", "Arteon", "Beetle", "Caddy", "California", "Golf", "Golf GTI", "Golf R", "ID.3", "ID.4", "ID.5", "Passat", "Polo", "Scirocco", "Sharan", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Touran", "Transporter", "Up"],
  "Volvo": ["C30", "C40", "S40", "S60", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],
};

const CAR_BRANDS = [
  "Abarth",
  "Alfa Romeo",
  "Alpina",
  "Alpine",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Cupra",
  "Dacia",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "DS Automobiles",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Saab",
  "Seat",
  "Škoda",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

function formatPricePosition(value: number) {
  const abs = Math.abs(value).toFixed(1);

  if (value > 0) {
    return `${abs}% sous le marché`;
  }

  if (value < 0) {
    return `${abs}% au-dessus du marché`;
  }

  return "Aligné au marché";
}

function ScoreProgressBar({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(10, score));
  const width = `${safeScore * 10}%`;

  return (
    <div style={progressOuterStyle}>
      <div style={progressTrackStyle}>
        <div style={{ ...progressFillStyle, width }} />
      </div>

      <div style={progressLabelsStyle}>
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}

function ScoreCard({ result }: { result: ScoreResult }) {
  const scoreColor = getScoreColor(result.score);
  const scoreLabel = getScoreLabel(result.score);
  const scoreMessage = getScoreMessage(result.score);

  return (
    <div style={scoreCardStyle}>
      <div style={scoreCardGlowStyle} />

      <div style={scoreHeaderStyle}>
        <div>
          <div style={brandMiniStyle}>
            <span style={brandIconStyle}>◔</span>
            <span>
              Auto<span style={{ color: "#16a34a" }}>Score</span>
            </span>
          </div>

          <p style={scoreEyebrowStyle}>Votre score d’annonce</p>
        </div>

        <div style={{ ...statusPillStyle, color: scoreColor, borderColor: scoreColor }}>
          ★ {scoreLabel}
        </div>
      </div>

      <div style={scoreMainStyle}>
        <div style={{ ...scoreNumberStyle, color: scoreColor }}>
          {result.score.toFixed(1)}
        </div>

        <div style={scoreOutOfStyle}>/ 10</div>
      </div>

      <ScoreProgressBar score={result.score} />

      <div style={scoreMessageStyle}>
        <div style={scoreMessageIconStyle}>↗</div>
        <p>{scoreMessage}</p>
      </div>

      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>Prix marché estimé</span>
          <strong style={metricValueStyle}>{formatCHF(result.marketPrice)}</strong>
        </div>

        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>Position prix</span>
          <strong style={{ ...metricValueStyle, color: scoreColor }}>
            {formatPricePosition(result.discountPercent)}
          </strong>
        </div>
      </div>

      <div style={confidenceStyle}>
        <span>◇</span>
        Calculé à partir des critères véhicule, prix demandé, demande et liquidité.
      </div>
    </div>
  );
}

export default function ScorePage() {
  const [form, setForm] = useState<FormState>({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    askingPrice: "",
    saleTiming: "",
    generalCondition: "",
    negotiablePrice: "",
  });

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleScore() {
    setError("");

    if (!form.brand || !form.model || !form.year || !form.mileage || !form.askingPrice) {
      setError("Remplis les champs obligatoires pour calculer ton AutoScore.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Score error");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Impossible de calculer le score pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <header style={headerStyle}>
          <Link href="/" style={logoStyle}>
            Auto<span style={{ color: "#16a34a" }}>score</span>
          </Link>

          <span style={headerPillStyle}>Déposer une annonce</span>
        </header>

        <section style={heroStyle}>
          <div>
            <p style={kickerStyle}>Score propriétaire Autoscore</p>

            <h1 style={titleStyle}>
              Score ta voiture avant de publier
            </h1>

            <p style={subtitleStyle}>
              Autoscore analyse ton prix demandé, le marché, la demande du modèle
              et la facilité de revente pour transformer ton annonce en décision claire.
            </p>
          </div>
        </section>

        <section style={gridStyle}>
          <div style={formCardStyle}>
            <h2 style={cardTitleStyle}>Votre véhicule</h2>

            <div style={formGridStyle}>
              <label style={labelStyle}>
                Marque *
                <select
                  style={inputStyle}
                  value={form.brand}
                  onChange={(e) => {
                    updateField("brand", e.target.value);
                    updateField("model", "");
                  }}
                >
                  <option value="">Sélectionner une marque</option>
                  {CAR_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Modèle *
                <select
                  style={inputStyle}
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  disabled={!form.brand}
                >
                  <option value="">
                    {form.brand ? "Sélectionner un modèle" : "Sélectionnez d’abord une marque"}
                  </option>
                  {(CAR_MODELS_BY_BRAND[form.brand] || []).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Année *
                <select
                  style={inputStyle}
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                >
                  <option value="">Sélectionner une année</option>
                  {CAR_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Kilométrage *
                <input
                  style={inputStyle}
                  type="number"
                  value={form.mileage}
                  onChange={(e) => updateField("mileage", e.target.value)}
                  placeholder="ex: 50000"
                />
              </label>

              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Prix demandé *
                <input
                  style={inputStyle}
                  type="number"
                  value={form.askingPrice}
                  onChange={(e) => updateField("askingPrice", e.target.value)}
                  placeholder="ex: 100000"
                />
              </label>

              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Délai de vente souhaité
                <select
                  style={inputStyle}
                  value={form.saleTiming}
                  onChange={(e) => updateField("saleTiming", e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="immediate">Vente immédiate</option>
                  <option value="1-3">1 à 3 mois</option>
                  <option value="3-6">3 à 6 mois</option>
                </select>
              </label>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <button
              onClick={handleScore}
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Analyse en cours..." : result ? "Recalculer mon AutoScore" : "Calculer mon AutoScore"}
            </button>
          </div>

          <div style={resultPanelStyle}>
            {!result ? (
              <div style={emptyResultStyle}>
                <div style={emptyIconStyle}>◔</div>
                <h2 style={emptyTitleStyle}>Votre AutoScore apparaîtra ici</h2>
                <p style={emptyTextStyle}>
                  Après calcul, vous verrez un score clair, une lecture du marché
                  et les leviers pour améliorer votre annonce.
                </p>
              </div>
            ) : (
              <>
                <ScoreCard result={result} />

                <div style={reasonsCardStyle}>
                  <h3 style={sectionTitleStyle}>Pourquoi ce score ?</h3>

                  <div style={reasonsListStyle}>
                    {result.reasons.map((reason) => (
                      <div key={reason} style={reasonItemStyle}>
                        <span style={reasonIconStyle}>✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.warnings.length > 0 && (
                  <div style={warningStyle}>
                    {result.warnings.map((warning) => (
                      <p key={warning}>⚠️ {warning}</p>
                    ))}
                  </div>
                )}

                {result.score < 6 && (
                  <div style={recalculateBoxStyle}>
                    <h3 style={sectionTitleStyle}>Améliorer votre AutoScore</h3>

                    <p style={recalculateTextStyle}>
                      Fourchette conseillée :{" "}
                      <strong>{formatCHF(result.recommendedPriceMin)}</strong> –{" "}
                      <strong>{formatCHF(result.recommendedPriceMax)}</strong>
                    </p>

                    <input
                      style={inputStyle}
                      type="number"
                      value={form.askingPrice}
                      onChange={(e) => updateField("askingPrice", e.target.value)}
                      placeholder="Nouveau prix demandé"
                    />

                    <label style={labelStyle}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  État général
                  <span
                    title={"Excellent : Véhicule très soigné, aucun frais connu à prévoir.\n\nBon : Véhicule propre, usure normale, entretien suivi.\n\nCorrect : Véhicule roulant, mais quelques défauts visibles ou frais légers possibles.\n\nFrais à prévoir : Réparations, entretien important, carrosserie, pneus, freins ou expertise à prévoir."}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "help",
                      background: "#E8F0FE",
                      color: "#1E40AF",
                      border: "1px solid #BFDBFE",
                    }}
                  >
                    i
                  </span>
                </span>
                <select
                  style={inputStyle}
                  value={form.generalCondition}
                  onChange={(e) => updateField("generalCondition", e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Bon</option>
                  <option value="fair">Correct</option>
                  <option value="work-needed">Frais à prévoir</option>
                </select>
              </label>

              <label style={labelStyle}>
                Prix négociable
                <select
                  style={inputStyle}
                  value={form.negotiablePrice}
                  onChange={(e) => updateField("negotiablePrice", e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                </select>
              </label>

              <button
                      onClick={handleScore}
                      disabled={loading}
                      style={{
                        ...primaryButtonStyle,
                        marginTop: 12,
                        opacity: loading ? 0.65 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Recalcul..." : "Recalculer avec ce prix"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
  color: "#0f172a",
  fontFamily: "Inter, Arial, sans-serif",
  padding: 28,
};

const shellStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
};

const headerStyle: CSSProperties = {
  marginBottom: 36,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle: CSSProperties = {
  color: "#0f172a",
  textDecoration: "none",
  fontSize: 30,
  fontWeight: 950,
  letterSpacing: -0.8,
};

const headerPillStyle: CSSProperties = {
  border: "1px solid #bbf7d0",
  background: "#dcfce7",
  color: "#166534",
  padding: "9px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 900,
};

const heroStyle: CSSProperties = {
  marginBottom: 30,
};

const kickerStyle: CSSProperties = {
  color: "#16a34a",
  fontSize: 14,
  fontWeight: 950,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: 10,
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(36px, 5vw, 58px)",
  lineHeight: 1.02,
  letterSpacing: -2.4,
  margin: 0,
  marginBottom: 14,
};

const subtitleStyle: CSSProperties = {
  color: "#475569",
  fontSize: 18,
  lineHeight: 1.7,
  maxWidth: 790,
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
  gap: 24,
  alignItems: "start",
};

const formCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 30,
  padding: 30,
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
};

const cardTitleStyle: CSSProperties = {
  fontSize: 26,
  margin: 0,
  marginBottom: 24,
  letterSpacing: -0.6,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "#334155",
  fontSize: 13,
  fontWeight: 900,
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 16,
  padding: "15px 16px",
  fontSize: 16,
  outline: "none",
  background: "#fff",
};

const errorStyle: CSSProperties = {
  marginTop: 16,
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: 16,
  padding: 14,
  fontWeight: 800,
  fontSize: 14,
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: 22,
  border: "none",
  borderRadius: 18,
  padding: "17px 18px",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 950,
  fontSize: 16,
};

const resultPanelStyle: CSSProperties = {
  display: "grid",
  gap: 18,
};

const emptyResultStyle: CSSProperties = {
  minHeight: 620,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 30,
  padding: 30,
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#64748b",
};

const emptyIconStyle: CSSProperties = {
  fontSize: 76,
  color: "#16a34a",
  marginBottom: 18,
};

const emptyTitleStyle: CSSProperties = {
  fontSize: 32,
  color: "#334155",
  margin: 0,
  marginBottom: 12,
};

const emptyTextStyle: CSSProperties = {
  maxWidth: 440,
  fontSize: 18,
  lineHeight: 1.7,
  margin: 0,
};

const scoreCardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 30,
  padding: 34,
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
};

const scoreCardGlowStyle: CSSProperties = {
  position: "absolute",
  width: 260,
  height: 260,
  borderRadius: "50%",
  right: -90,
  top: -110,
  background: "radial-gradient(circle, rgba(22,163,74,0.15), rgba(22,163,74,0))",
};

const scoreHeaderStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "flex-start",
  marginBottom: 28,
};

const brandMiniStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#0f172a",
  fontSize: 28,
  fontWeight: 950,
  letterSpacing: -0.8,
};

const brandIconStyle: CSSProperties = {
  color: "#16a34a",
  fontSize: 30,
  lineHeight: 1,
};

const scoreEyebrowStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 15,
  fontWeight: 700,
  margin: "18px 0 0 0",
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid",
  borderRadius: 999,
  padding: "8px 12px",
  background: "#fff",
  fontSize: 14,
  fontWeight: 950,
  whiteSpace: "nowrap",
};

const scoreMainStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 12,
  marginBottom: 20,
};

const scoreNumberStyle: CSSProperties = {
  fontSize: "clamp(72px, 10vw, 112px)",
  fontWeight: 950,
  lineHeight: 0.9,
  letterSpacing: -6,
};

const scoreOutOfStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 34,
  fontWeight: 800,
};

const progressOuterStyle: CSSProperties = {
  marginBottom: 22,
};

const progressTrackStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: 14,
  borderRadius: 999,
  background: "#e5e7eb",
  overflow: "hidden",
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 48%, #16a34a 100%)",
  transition: "width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
};

const progressLabelsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
  color: "#94a3b8",
  fontSize: 14,
  fontWeight: 800,
};

const scoreMessageStyle: CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "center",
  padding: 18,
  border: "1px solid #bbf7d0",
  borderRadius: 18,
  background: "#f0fdf4",
  color: "#166534",
  fontWeight: 800,
  lineHeight: 1.55,
  marginBottom: 20,
};

const scoreMessageIconStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#dcfce7",
  color: "#16a34a",
  fontSize: 24,
  flex: "0 0 auto",
};

const metricsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const metricCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  background: "#f8fafc",
};

const metricLabelStyle: CSSProperties = {
  display: "block",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 900,
  marginBottom: 7,
};

const metricValueStyle: CSSProperties = {
  color: "#0f172a",
  fontSize: 28,
  fontWeight: 950,
  letterSpacing: -1.2,
};

const confidenceStyle: CSSProperties = {
  marginTop: 20,
  color: "#64748b",
  fontSize: 13,
  fontWeight: 700,
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const reasonsCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 30,
  padding: 28,
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.06)",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 21,
  margin: 0,
  marginBottom: 16,
  letterSpacing: -0.5,
};

const reasonsListStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const reasonItemStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  color: "#334155",
  fontSize: 15,
  fontWeight: 800,
};

const reasonIconStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#16a34a",
  background: "#dcfce7",
  fontWeight: 950,
  flex: "0 0 auto",
};

const warningStyle: CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
  padding: 18,
  borderRadius: 20,
  fontWeight: 800,
};

const recalculateBoxStyle: CSSProperties = {
  padding: 24,
  borderRadius: 28,
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
};

const recalculateTextStyle: CSSProperties = {
  color: "#166534",
  lineHeight: 1.6,
  marginBottom: 14,
};
