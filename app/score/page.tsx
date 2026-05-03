"use client";

import { useState } from "react";
import Link from "next/link";
import AutoscoreGauge from "@/components/AutoscoreGauge";

interface ScoreResult {
  score: number;
  marketPrice: number;
  discountPercent: number;
  recommendedPriceMin: number;
  recommendedPriceMax: number;
  reasons: string[];
  warnings: string[];
  suggestion?: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function ScorePage() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: String(CURRENT_YEAR - 5),
    mileage: "",
    askingPrice: "",
    description: "",
  });

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adjusted price for recalculation
  const [newPrice, setNewPrice] = useState("");
  const [recalcLoading, setRecalcLoading] = useState(false);

  async function callScoreAPI(payload: typeof form & { askingPrice: string }) {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: payload.brand,
        model: payload.model,
        year: Number(payload.year),
        mileage: Number(payload.mileage.replace(/\s/g, "")),
        askingPrice: Number(payload.askingPrice.replace(/\s/g, "")),
        description: payload.description,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Erreur lors du calcul.");
    }

    return res.json() as Promise<ScoreResult>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setNewPrice("");
    setLoading(true);

    try {
      const data = await callScoreAPI(form);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecalculate() {
    if (!newPrice.trim()) return;
    setRecalcLoading(true);
    setError(null);

    try {
      const data = await callScoreAPI({ ...form, askingPrice: newPrice });
      setResult(data);
      setForm((prev) => ({ ...prev, askingPrice: newPrice }));
      setNewPrice("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setRecalcLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const fmt = (n: number) =>
    n.toLocaleString("fr-CH") + " CHF";

  const discountLabel =
    result && result.discountPercent > 0
      ? `${result.discountPercent.toFixed(1)}% sous le marché`
      : result && result.discountPercent < 0
      ? `${Math.abs(result.discountPercent).toFixed(1)}% au-dessus du marché`
      : "Aligné avec le marché";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-800 transition-colors text-sm flex items-center gap-1"
            aria-label="Retour à l'accueil"
          >
            ← Accueil
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-gray-900 font-bold text-lg tracking-tight">
            Autoscore
            <span className="text-blue-600">.ch</span>
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Calculer le score de votre annonce
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            Renseignez les informations de votre véhicule. Autoscore analyse le
            prix, la demande et la liquidité pour vous donner un score sur 10.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marque <span className="text-red-500">*</span>
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                required
                placeholder="ex: BMW, Audi, Toyota…"
                value={form.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Modèle <span className="text-red-500">*</span>
              </label>
              <input
                id="model"
                name="model"
                type="text"
                required
                placeholder="ex: M3, GTI, Corolla…"
                value={form.model}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Année <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                required
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kilométrage <span className="text-red-500">*</span>
              </label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                required
                min={0}
                max={999999}
                placeholder="ex: 85000"
                value={form.mileage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Asking price */}
            <div>
              <label
                htmlFor="askingPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prix demandé (CHF) <span className="text-red-500">*</span>
              </label>
              <input
                id="askingPrice"
                name="askingPrice"
                type="number"
                required
                min={100}
                placeholder="ex: 14900"
                value={form.askingPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description / Remarques
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="ex: Vente urgente, déménagement, prix négociable…"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-semibold px-8 py-3 transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Calcul en cours…" : "Calculer mon score"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Score card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Votre Autoscore
              </h3>

              {/* Gauge */}
              <AutoscoreGauge score={result.score} />

              {/* Key metrics */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Prix marché estimé
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {fmt(result.marketPrice)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Votre prix
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {fmt(Number(form.askingPrice))}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Position prix
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      result.discountPercent > 0
                        ? "text-green-600"
                        : result.discountPercent < -5
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {discountLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Reasons */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">📊</span> Analyse
                </h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                  <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Points d&apos;attention
                  </h4>
                  <ul className="space-y-2">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-amber-800">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* If no warnings, show recommended range */}
              {result.warnings.length === 0 && (
                <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
                  <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span>💰</span> Fourchette recommandée
                  </h4>
                  <p className="text-sm text-green-800">
                    Entre{" "}
                    <strong>{fmt(result.recommendedPriceMin)}</strong> et{" "}
                    <strong>{fmt(result.recommendedPriceMax)}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Suggestion + recalculate if score is low */}
            {result.suggestion && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>💡</span> Conseil Autoscore
                </h4>
                <p className="text-sm text-blue-800 mb-4">{result.suggestion}</p>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1">
                    <label
                      htmlFor="newPrice"
                      className="block text-xs font-medium text-blue-800 mb-1"
                    >
                      Fourchette : {fmt(result.recommendedPriceMin)} –{" "}
                      {fmt(result.recommendedPriceMax)}
                    </label>
                    <input
                      id="newPrice"
                      type="number"
                      min={100}
                      placeholder="Nouveau prix demandé (CHF)"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm
                                 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRecalculate}
                    disabled={recalcLoading || !newPrice.trim()}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                               text-white font-semibold px-5 py-2.5 text-sm transition-colors
                               focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                  >
                    {recalcLoading ? "Calcul…" : "Recalculer avec ce prix"}
                  </button>
                </div>
              </div>
            )}

            {/* Recommended price range (always shown when score is good) */}
            {!result.suggestion && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Fourchette de prix recommandée
                </h4>
                <p className="text-gray-600 text-sm">
                  Pour maximiser vos chances de vente rapide, positionnez-vous entre{" "}
                  <span className="font-semibold text-gray-900">
                    {fmt(result.recommendedPriceMin)}
                  </span>{" "}
                  et{" "}
                  <span className="font-semibold text-gray-900">
                    {fmt(result.recommendedPriceMax)}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
