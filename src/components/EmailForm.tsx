"use client";

import { useState } from "react";

export function EmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md mb-10 rounded-xl border border-green-200 bg-white/90 px-6 py-4 text-sm font-medium" style={{ color: "#3a9e5f" }}>
        ✓ Merci ! Vous serez notifié en avant-première.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md mb-10">
      <p className="text-sm text-gray-500 mb-3">Soyez notifié en avant-première</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
        <button
          type="submit"
          className="rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#3a9e5f" }}
        >
          Me notifier
        </button>
      </form>
    </div>
  );
}
