import Link from "next/link";

const G = "#3a9e5f";
const D = "#1a2e3b";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-14"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.86) 0%, rgba(248,253,250,0.82) 55%, rgba(240,250,245,0.78) 100%), url('/bg-alpes.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "88vh",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <svg width="62" height="62" viewBox="0 0 100 100" fill="none">
            <path d="M15 72 A38 38 0 1 1 85 72" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M15 72 A38 38 0 0 1 50 12" stroke={G} strokeWidth="8" strokeLinecap="round" fill="none"/>
            <line x1="50" y1="50" x2="24" y2="28" stroke={D} strokeWidth="4" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="5" fill={D}/>
          </svg>
          <div className="text-left">
            <div className="font-extrabold text-[2rem] leading-tight" style={{ color: D }}>
              Auto<span style={{ color: G }}>score</span>
            </div>
            <div className="text-[10px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#9ca3af" }}>
              Les meilleures occasions auto
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-extrabold leading-tight mb-5 max-w-3xl" style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", color: D }}>
          Les meilleures <span style={{ color: G }}>occasions</span> auto,<br />
          analysées et sélectionnées
        </h1>
        <p className="text-lg mb-10 max-w-xl" style={{ color: "#6b7280" }}>
          Autoscore identifie et classe les meilleures opportunités du marché<br />
          pour vous faire gagner du temps et prendre les bonnes décisions.
        </p>

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-3 bg-white/90 border border-gray-200 rounded-2xl px-6 py-4 shadow-sm mb-12">
          <svg className="w-6 h-6 shrink-0" style={{ color: G }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div className="text-left">
            <p className="font-bold text-gray-900 text-sm">Coming soon...</p>
            <p className="text-gray-400 text-sm">Restez connecté, de grandes choses arrivent.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 w-full max-w-3xl">
          {/* Vendre — actif */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 text-left">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#dff0e8" }}>
              <svg className="w-7 h-7" style={{ color: G }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 17h18M3 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M7 21a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: D }}>Vendre ma voiture</h3>
            <p className="text-sm font-semibold mb-3" style={{ color: G }}>Publiez votre véhicule gratuitement</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#9ca3af" }}>
              Touchez plus d'acheteurs qualifiés et<br />vendez rapidement, au bon prix.
            </p>
            <Link
              href="/vendre"
              className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: G }}
            >
              Déposer mon annonce →
            </Link>
          </div>

          {/* Trouver — bientôt */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M7 17V13M12 17V7M17 17V11"/>
              </svg>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#dff0e8" }}>
              <svg className="w-7 h-7" style={{ color: G }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: D }}>Trouver des occasions</h3>
            <p className="text-sm font-semibold mb-3" style={{ color: G }}>Accédez à des opportunités qualifiées</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#9ca3af" }}>
              Des véhicules sélectionnés selon des critères<br />clés pour acheter mieux et plus efficacement.
            </p>
            <button disabled className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm text-gray-400 bg-gray-100 cursor-not-allowed">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Bientôt disponible
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { path: "M22 12h-4l-3 9L9 3l-3 9H2", title: "Analyse intelligente", desc: "Des données fiables et actualisées pour évaluer chaque opportunité." },
            { path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Sélection rigoureuse", desc: "Uniquement les meilleures occasions selon nos critères exclusifs." },
            { path: "M12 2a10 10 0 110 20A10 10 0 0112 2zM12 6v6l4 2", title: "Gain de temps", desc: "Fini les recherches interminables, concentrez-vous sur l'essentiel." },
            { path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Décisions éclairées", desc: "Des informations claires pour acheter ou vendre en toute confiance." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#dff0e8" }}>
                <svg className="w-5 h-5" style={{ color: G }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={f.path}/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5" style={{ color: D }}>{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-5 text-center text-sm" style={{ background: D, color: "#9ca3af" }}>
        © 2026{" "}
        <span className="font-bold text-white">
          Auto<span style={{ color: G }}>score</span>.ch
        </span>
        {" "}— Les meilleures occasions auto en Suisse
      </footer>
    </div>
  );
}
