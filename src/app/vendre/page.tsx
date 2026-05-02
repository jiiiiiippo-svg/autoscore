"use client";

import { useState } from "react";
import Link from "next/link";

const GREEN = "#3a9e5f";
const DARK = "#1a2e3b";

const MARQUES = [
  "Audi", "BMW", "Citroën", "Fiat", "Ford", "Honda", "Hyundai", "Kia",
  "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo", "Autre",
];

const ANNEES = Array.from({ length: 30 }, (_, i) => 2025 - i);

type Step = 1 | 2 | 3;

export default function VendrePage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    marque: "", modele: "", annee: "", km: "", prix: "",
    nom: "", telephone: "", email: "", description: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function nextStep() {
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }

  function prevStep() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#e0f0e8" }}>
            <svg className="w-8 h-8" style={{ color: GREEN }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: DARK }}>Annonce reçue !</h2>
          <p className="text-gray-500 mb-8">
            Merci <strong>{form.nom}</strong>, votre <strong>{form.marque} {form.modele}</strong> a bien été enregistrée.<br />
            Nous vous contactons sous 24h au <strong>{form.telephone}</strong>.
          </p>
          <Link href="/" className="inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <path d="M 15 72 A 38 38 0 1 1 85 72" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 15 72 A 38 38 0 0 1 50 12" stroke={GREEN} strokeWidth="8" strokeLinecap="round" fill="none" />
              <line x1="50" y1="50" x2="24" y2="28" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="50" r="5" fill={DARK} />
            </svg>
            <span className="font-bold text-lg" style={{ color: DARK }}>
              Auto<span style={{ color: GREEN }}>score</span>
            </span>
          </Link>
          <span className="text-sm text-gray-400">Déposer une annonce</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { n: 1, label: "Véhicule" },
            { n: 2, label: "Contact" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor: step >= n ? GREEN : "#e5e7eb",
                  color: step >= n ? "white" : "#9ca3af",
                }}
              >
                {step > n ? "✓" : n}
              </div>
              <span className="text-sm font-medium" style={{ color: step >= n ? DARK : "#9ca3af" }}>{label}</span>
              {n < 2 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-6" style={{ color: DARK }}>Votre véhicule</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Marque *</label>
                    <select
                      value={form.marque}
                      onChange={(e) => set("marque", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Sélectionner</option>
                      {MARQUES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Modèle *</label>
                    <input
                      type="text"
                      placeholder="ex: Golf, 308…"
                      value={form.modele}
                      onChange={(e) => set("modele", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Année *</label>
                    <select
                      value={form.annee}
                      onChange={(e) => set("annee", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Sélectionner</option>
                      {ANNEES.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Kilométrage *</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="ex: 85000"
                        value={form.km}
                        onChange={(e) => set("km", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">km</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Prix demandé *</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="ex: 12500"
                      value={form.prix}
                      onChange={(e) => set("prix", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-16 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">CHF</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Description (optionnel)</label>
                  <textarea
                    rows={3}
                    placeholder="État général, options, historique d'entretien…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!form.marque || !form.modele || !form.annee || !form.km || !form.prix}
                className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Continuer →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-1" style={{ color: DARK }}>Vos coordonnées</h2>
              <p className="text-sm text-gray-400 mb-6">Pour que les acheteurs puissent vous contacter.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Prénom & Nom *</label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={form.nom}
                    onChange={(e) => set("nom", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="+41 79 000 00 00"
                    value={form.telephone}
                    onChange={(e) => set("telephone", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Email *</label>
                  <input
                    type="email"
                    placeholder="jean@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="flex-1 rounded-xl py-3.5 text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Retour
                </button>
                <button
                  onClick={nextStep}
                  disabled={!form.nom || !form.telephone || !form.email}
                  className="flex-[2] rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: GREEN }}
                >
                  Publier mon annonce ✓
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
