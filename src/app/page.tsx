import Link from "next/link";
import Image from "next/image";

const GREEN = "#16a34a";
const DARK = "#1a2e3b";

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0, background: "white" }}>

      {/* ── Header ── */}
      <header style={{ background: "white", padding: "22px 24px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <Image src="/apple-touch-icon.png" alt="Autoscore logo" width={40} height={40} unoptimized />
          <span style={{ fontSize: 28, fontWeight: 800, color: DARK, letterSpacing: "-0.5px" }}>
            Auto<span style={{ color: GREEN }}>score</span>
          </span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>
          Les meilleures occasions auto
        </p>
      </header>

      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/autoscore-landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 42%",
        padding: "48px 24px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        {/* overlay — keeps mountain/car silhouette, hides text duplication from PNG */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(248,250,252,0.94)" }} />

        {/* all content above the overlay */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 800, lineHeight: 1.15, maxWidth: 640, margin: "0 0 16px" }}>
            Les meilleures{" "}
            <em style={{ color: GREEN, fontStyle: "italic" }}>occasions</em>{" "}
            auto,<br />analysées et sélectionnées
          </h1>

          <p style={{ color: "#475569", fontSize: 15, maxWidth: 460, margin: "0 0 28px", lineHeight: 1.65 }}>
            Autoscore identifie et classe les meilleures opportunités du marché pour vous faire gagner du temps et prendre les bonnes décisions.
          </p>

          {/* Coming soon badge */}
          <div style={{ background: "white", borderRadius: 16, padding: "12px 24px", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 44, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: DARK, fontWeight: 700, fontSize: 15 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" />
              </svg>
              Coming soon…
            </div>
            <p style={{ color: "#64748b", fontSize: 12.5, margin: 0 }}>Restez connecté, de grandes choses arrivent.</p>
          </div>

          {/* ── Cards row ── */}
          <div style={{ display: "flex", gap: 20, maxWidth: 860, width: "100%", alignItems: "stretch" }}>

            {/* Vendre card */}
            <div className="card">
              <div className="card-content">
                <div className="card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17h18M3 17V9l3-4h12l3 4v8M3 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                  </svg>
                </div>
                <div>
                  <h3>Vendre ma voiture</h3>
                  <p className="card-subtitle">Publiez votre véhicule gratuitement</p>
                  <p className="card-desc">Touchez plus d'acheteurs qualifiés et vendez rapidement, au bon prix.</p>
                </div>
              </div>
              <Link href="/vendre" className="card-button active">
                Déposer une annonce
              </Link>
            </div>

            {/* Center logo */}
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "center", boxShadow: "0 4px 18px rgba(26,46,59,0.28)" }}>
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <path d="M18 70 A34 34 0 1 1 82 70" stroke="rgba(255,255,255,0.2)" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M18 70 A34 34 0 0 1 50 18" stroke={GREEN} strokeWidth="8" strokeLinecap="round" fill="none" />
                <line x1="50" y1="50" x2="27" y2="31" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="5" fill="white" />
              </svg>
            </div>

            {/* Trouver card */}
            <div className="card">
              <div className="card-content">
                <div className="card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <h3>Trouver des occasions</h3>
                  <p className="card-subtitle">Accédez à des opportunités qualifiées</p>
                  <p className="card-desc">Des véhicules sélectionnés selon des critères clés pour acheter mieux et plus efficacement.</p>
                </div>
              </div>
              <div className="card-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Bientôt disponible
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "34px 24px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 26 }}>
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>, title: "Analyse intelligente", desc: "Des données fiables et actualisées pour évaluer chaque opportunité." },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: "Sélection rigoureuse", desc: "Uniquement les meilleures occasions selon nos critères exclusifs." },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, title: "Gain de temps", desc: "Fini les recherches interminables, concentrez-vous sur l'essentiel." },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>, title: "Décisions éclairées", desc: "Des informations claires pour acheter ou vendre en toute confiance." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ color: DARK, fontWeight: 700, fontSize: 13, margin: "0 0 3px" }}>{title}</p>
                <p style={{ color: "#64748b", fontSize: 11.5, lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: DARK, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
          © 2026 <strong style={{ color: "white" }}>Autoscore.ch</strong> — Les meilleures occasions auto en Suisse
        </p>
      </footer>

    </main>
  );
}
