import Link from "next/link";

const GREEN = "#3a9e5f";
const DARK = "#1a2e3b";

function Logo() {
  return (
    <div className="flex items-center gap-3 justify-center mb-10">
      <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
        <path d="M 15 72 A 38 38 0 1 1 85 72" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 15 72 A 38 38 0 0 1 50 12" stroke={GREEN} strokeWidth="8" strokeLinecap="round" fill="none" />
        <line x1="50" y1="50" x2="24" y2="28" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="5" fill={DARK} />
      </svg>
      <div>
        <div className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
          Auto<span style={{ color: GREEN }}>score</span>
        </div>
        <div className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-0.5">
          Les meilleures occasions auto
        </div>
      </div>
    </div>
  );
}

function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#e0f0e8" }}>
      {children}
    </div>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.82) 0%, rgba(248,252,250,0.78) 60%, rgba(240,248,244,0.72) 100%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          <Logo />

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5" style={{ color: DARK }}>
            Les meilleures <span style={{ color: GREEN }}>occasions</span> auto,<br />
            analysées et sélectionnées
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Autoscore identifie et classe les meilleures opportunités du marché<br />
            pour vous faire gagner du temps et prendre les bonnes décisions.
          </p>

          {/* Coming soon badge */}
          <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-7 py-4 shadow-sm mb-12">
            <svg className="w-6 h-6" style={{ color: GREEN }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="text-left">
              <p className="font-bold text-gray-900">Coming soon...</p>
              <p className="text-sm text-gray-400">Restez connecté, de grandes choses arrivent.</p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Vendre — ACTIF */}
            <div className="rounded-2xl bg-white p-7 shadow-lg border border-gray-100 text-left">
              <CardIcon>
                <svg className="w-8 h-8" style={{ color: GREEN }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </CardIcon>
              <h3 className="text-xl font-bold mb-1" style={{ color: DARK }}>Vendre ma voiture</h3>
              <p className="text-sm font-semibold mb-3" style={{ color: GREEN }}>Publiez votre véhicule gratuitement</p>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Touchez plus d'acheteurs qualifiés et vendez rapidement, au bon prix.
              </p>
              <Link
                href="/vendre"
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Déposer mon annonce →
              </Link>
            </div>

            {/* Trouver — bientôt */}
            <div className="rounded-2xl bg-white p-7 shadow-lg border border-gray-100 text-left relative overflow-hidden">
              <div className="absolute right-4 top-4 w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center opacity-75">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 17V13M12 17V7M17 17V11" />
                </svg>
              </div>
              <CardIcon>
                <svg className="w-8 h-8" style={{ color: GREEN }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </CardIcon>
              <h3 className="text-xl font-bold mb-1" style={{ color: DARK }}>Trouver des occasions</h3>
              <p className="text-sm font-semibold mb-3" style={{ color: GREEN }}>Accédez à des opportunités qualifiées</p>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Des véhicules sélectionnés selon des critères clés pour acheter mieux et plus efficacement.
              </p>
              <button disabled className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm text-gray-400 bg-gray-100 cursor-not-allowed">
                <LockIcon /> Bientôt disponible
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "M22 12h-4l-3 9L9 3l-3 9H2", title: "Analyse intelligente", desc: "Des données fiables et actualisées pour évaluer chaque opportunité." },
            { icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z", title: "Sélection rigoureuse", desc: "Uniquement les meilleures occasions selon nos critères exclusifs." },
            { icon: "M12 2a10 10 0 110 20A10 10 0 0112 2zM12 6v6l4 2", title: "Gain de temps", desc: "Fini les recherches interminables, concentrez-vous sur l'essentiel." },
            { icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3", title: "Décisions éclairées", desc: "Des informations claires pour acheter ou vendre en toute confiance." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f0e8" }}>
                <svg className="w-5 h-5" style={{ color: GREEN }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1" style={{ color: DARK }}>{f.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400" style={{ backgroundColor: DARK }}>
        © 2026 <span className="font-bold text-white">Auto<span style={{ color: GREEN }}>score</span>.ch</span> — Les meilleures occasions auto en Suisse
      </footer>
    </div>
  );
}
