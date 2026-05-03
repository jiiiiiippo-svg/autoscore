"use client";

import { useState } from "react";
import AutoscoreGauge, { getScoreColor } from "@/components/AutoscoreGauge";

type FormState = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  askingPrice: string;
  description: string;
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

function formatCHF(value: number) {
  return new Intl.NumberFormat("fr-CH").format(value) + " CHF";
}

export default function SellerScorePage() {
  const [form, setForm] = useState<FormState>({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    askingPrice: "",
    description: "",
  });

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleScore() {
    setError(null);

    if (!form.brand || !form.model || !form.year || !form.mileage || !form.askingPrice) {
      setError("Remplis au minimum la marque, le modèle, l’année, le kilométrage et le prix demandé.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur scoring");

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Impossible de calculer le score pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = result ? getScoreColor(result.score) : "#16a34a";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <a href="/" className="text-3xl font-black tracking-[-0.8px]">
            Auto<span className="text-green-600">score</span>
          </a>
          <div className="rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm font-extrabold text-green-800">
            Score ta voiture
          </div>
        </header>

        <section className="mb-8">
          <h1 className="mb-3 text-4xl font-black tracking-[-1.8px] md:text-5xl">
            Obtiens le score de ton véhicule
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Autoscore analyse ton prix demandé, le marché, la demande du modèle et le potentiel de revente pour estimer l’attractivité de ton annonce.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
            <h2 className="mb-6 text-2xl font-black tracking-[-0.6px]">Informations véhicule</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700">
                Marque
                <input className="rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="BMW" />
              </label>

              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700">
                Modèle
                <input className="rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" value={form.model} onChange={(e) => updateField("model", e.target.value)} placeholder="M4" />
              </label>

              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700">
                Année
                <input className="rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" type="number" value={form.year} onChange={(e) => updateField("year", e.target.value)} placeholder="2022" />
              </label>

              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700">
                Kilométrage
                <input className="rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" type="number" value={form.mileage} onChange={(e) => updateField("mileage", e.target.value)} placeholder="50000" />
              </label>

              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700 md:col-span-2">
                Prix demandé
                <input className="rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" type="number" value={form.askingPrice} onChange={(e) => updateField("askingPrice", e.target.value)} placeholder="100000" />
              </label>

              <label className="flex flex-col gap-2 text-sm font-extrabold text-slate-700 md:col-span-2">
                Description
                <textarea className="min-h-28 resize-y rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Ex : Prix négociable, véhicule disponible rapidement, entretien à jour..." />
              </label>
            </div>

            {error && <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm font-bold text-red-800">{error}</div>}

            <button
              className="mt-5 w-full rounded-2xl bg-green-600 px-5 py-4 text-base font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleScore}
              disabled={loading}
            >
              {loading ? "Analyse en cours..." : result ? "Recalculer mon score" : "Calculer mon score"}
            </button>
          </div>

          <div className="min-h-[560px] rounded-[26px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
            {!result ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center text-slate-500">
                <div className="mb-4 text-7xl text-green-600">◔</div>
                <h2 className="mb-3 text-3xl font-black text-slate-800">Ton score apparaîtra ici</h2>
                <p className="max-w-md text-lg leading-8">Après calcul, l’aiguille se positionnera automatiquement selon l’attractivité de ton prix.</p>
              </div>
            ) : (
              <>
                <AutoscoreGauge score={result.score} />

                <div className="mt-2 grid overflow-hidden rounded-2xl border md:grid-cols-2" style={{ borderColor: scoreColor }}>
                  <div className="border-b border-slate-200 bg-slate-50 p-5 md:border-b-0 md:border-r">
                    <span className="mb-1 block text-xs font-extrabold text-slate-500">Prix marché estimé</span>
                    <strong className="text-xl">{formatCHF(result.marketPrice)}</strong>
                  </div>
                  <div className="bg-slate-50 p-5">
                    <span className="mb-1 block text-xs font-extrabold text-slate-500">Écart au marché</span>
                    <strong className="text-xl" style={{ color: scoreColor }}>{result.discountPercent}%</strong>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-black">Pourquoi ce score ?</h3>
                  <ul className="grid gap-2">
                    {result.reasons.map((reason) => (
                      <li className="text-sm font-bold text-slate-700" key={reason}>✓ {reason}</li>
                    ))}
                  </ul>
                </div>

                {result.warnings.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-800">
                    {result.warnings.map((warning) => <p key={warning}>⚠️ {warning}</p>)}
                  </div>
                )}

                {result.score < 6 && (
                  <div className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
                    <h3 className="mb-2 text-lg font-black">Améliore ton score</h3>
                    <p className="mb-4 leading-7 text-green-800">
                      Prix recommandé : <strong>{formatCHF(result.recommendedPriceMin)}</strong> – <strong>{formatCHF(result.recommendedPriceMax)}</strong>
                    </p>
                    <input
                      className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-4 text-base outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                      type="number"
                      value={form.askingPrice}
                      onChange={(e) => updateField("askingPrice", e.target.value)}
                      placeholder="Nouveau prix demandé"
                    />
                    <button
                      className="w-full rounded-2xl bg-green-600 px-5 py-4 font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleScore}
                      disabled={loading}
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
