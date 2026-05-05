import Link from "next/link";

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(34,197,94,0.16), transparent 34%), linear-gradient(135deg, #f8fafc 0%, #eef7f0 45%, #ffffff 100%)",
  color: "#0f172a",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

const containerStyle = {
  width: "min(1180px, calc(100% - 32px))",
  margin: "0 auto",
} as const;

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px 0",
} as const;

const brandStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  color: "#0f172a",
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: "0em",
} as const;

const navButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 18px",
  borderRadius: 999,
  background: "#16a34a",
  color: "white",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 800,
  boxShadow: "0 14px 30px rgba(22, 163, 74, 0.28)",
} as const;

const heroStyle = {
  display: "grid",
  gridTemplateColumns: "1.05fr 0.95fr",
  gap: 48,
  alignItems: "center",
  padding: "54px 0 72px",
} as const;

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 13px",
  borderRadius: 999,
  background: "rgba(22, 163, 74, 0.1)",
  color: "#15803d",
  fontSize: 14,
  fontWeight: 800,
  marginBottom: 22,
} as const;

const titleStyle = {
  fontSize: "clamp(44px, 7vw, 82px)",
  lineHeight: 1.022,
  letterSpacing: "-0.07em",
  margin: 0,
  maxWidth: 760,
} as const;

const subtitleStyle = {
  marginTop: 26,
  fontSize: "clamp(18px, 2.2vw, 23px)",
  lineHeight: 1.45,
  color: "#475569",
  maxWidth: 700,
} as const;

const ctaRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 14,
  marginTop: 34,
} as const;

const primaryCtaStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "17px 24px",
  borderRadius: 999,
  background: "#16a34a",
  color: "white",
  textDecoration: "none",
  fontSize: 17,
  fontWeight: 800,
  boxShadow: "0 18px 36px rgba(22, 163, 74, 0.28)",
} as const;

const secondaryTextStyle = {
  color: "#64748b",
  fontSize: 15,
  fontWeight: 700,
} as const;

const phoneCardStyle = {
  position: "relative",
  borderRadius: 34,
  padding: 24,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow: "0 30px 80px rgba(15, 23, 42, 0.12)",
  overflow: "hidden",
} as const;

const scoreCardStyle = {
  borderRadius: 28,
  padding: 26,
  background: "#0f172a",
  color: "white",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
} as const;

const scoreCircleStyle = {
  width: 170,
  height: 170,
  borderRadius: "50%",
  margin: "24px auto",
  display: "grid",
  placeItems: "center",
  background:
    "conic-gradient(#22c55e 0deg 292deg, rgba(255,255,255,0.14) 292deg 360deg)",
  boxShadow: "0 0 0 12px rgba(34,197,94,0.12)",
} as const;

const scoreInnerStyle = {
  width: 128,
  height: 128,
  borderRadius: "50%",
  background: "#0f172a",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
} as const;

const statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 14,
  marginTop: 22,
} as const;

const statStyle = {
  borderRadius: 20,
  padding: 16,
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(148, 163, 184, 0.22)",
} as const;

const sectionStyle = {
  padding: "34px 0 72px",
} as const;

const cardsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 18,
} as const;

const featureCardStyle = {
  borderRadius: 28,
  padding: 24,
  background: "white",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
} as const;

const iconStyle = {
  width: 44,
  height: 44,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  background: "#dcfce7",
  color: "#15803d",
  fontWeight: 800,
  marginBottom: 18,
} as const;

export default function Home() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <Link href="/" style={brandStyle}>
            <img
              src="/favicon-512x512.png"
              alt="Autoscore"
              style={{
                width: 44,
                height: 44,
                objectFit: "contain",
                display: "block",
              }}
            />
            <span>
              Auto<span style={{ color: "#16a34a" }}>score</span>
            </span>
          </Link>

          <Link href="/score" style={navButtonStyle}>
            Déposer une annonce
          </Link>
        </header>

        <section style={heroStyle}>
          <div>
            <div style={badgeStyle}>✓ Gratuit pour les vendeurs particuliers</div>

            <h1 style={titleStyle}><>
              Scorez votre
              <br />
              voiture en
              <br />
              30 secondes
            </></h1>

            <p style={subtitleStyle}>
              Autoscore calcule l’attractivité de votre véhicule et le rend visible
              auprès de garages partenaires. Gratuit, rapide, zéro stress.
            </p>

            <div style={ctaRowStyle}>
              <Link href="/score" style={primaryCtaStyle}>
                Calculer mon AutoScore
              </Link>

              <span style={secondaryTextStyle}>
                Sans annonce complète. Sans photos obligatoires.
              </span>
            </div>
          </div>

          <div style={phoneCardStyle}>
            <div style={scoreCardStyle}>
              <div style={{ fontSize: 14, opacity: 0.72, fontWeight: 800 }}>
                AutoScore vendeur
              </div>

              <div style={scoreCircleStyle}>
                <div style={scoreInnerStyle}>
                  <div>
                    <div style={{ fontSize: 46, fontWeight: 950, lineHeight: 1 }}>
                      8.4
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                      /10
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>
                Véhicule attractif
              </div>

              <p
                style={{
                  margin: "10px auto 0",
                  maxWidth: 360,
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Votre voiture peut intéresser des garages partenaires selon son prix,
                son état et votre délai de vente.
              </p>
            </div>

            <div style={statGridStyle}>
              <div style={statStyle}>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 800 }}>
                  Contact
                </div>
                <div style={{ marginTop: 7, fontWeight: 950 }}>Sur accord</div>
              </div>

              <div style={statStyle}>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 800 }}>
                  Photos
                </div>
                <div style={{ marginTop: 7, fontWeight: 950 }}>Optionnel</div>
              </div>

              <div style={statStyle}>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 800 }}>
                  Frais
                </div>
                <div style={{ marginTop: 7, fontWeight: 950 }}>0 CHF</div>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={cardsStyle}>
            <div style={featureCardStyle}>
              <div style={iconStyle}>1</div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Renseignez l’essentiel</h2>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                Marque, modèle, année, kilométrage, prix demandé, état général et
                délai de vente.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>2</div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Obtenez votre score</h2>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                Autoscore mesure l’attractivité de votre véhicule et sa position par
                rapport au marché.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>3</div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Gardez le contrôle</h2>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                Si un garage est intéressé, votre contact n’est partagé qu’après
                votre accord.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
