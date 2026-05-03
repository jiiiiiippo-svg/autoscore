import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1536px",
          margin: "0 auto",
          background: "#fff",
        }}
      >
        <img
          src="/autoscore-landing.png"
          alt="Autoscore — Coming soon"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
          draggable={false}
        />

        <Link
          href="/score"
          aria-label="Déposer une annonce"
          title="Déposer une annonce"
          style={{
            position: "absolute",
            left: "18.16%",
            top: "69.53%",
            width: "25.52%",
            height: "5.47%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "14px",
            background: "#4da851",
            color: "#ffffff",
            textDecoration: "none",
            fontFamily: "Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(12px, 1.4vw, 22px)",
            lineHeight: 1,
            boxShadow: "0 6px 18px rgba(77, 168, 81, 0.18)",
          }}
        >
          Déposer une annonce
        </Link>
      </section>
    </main>
  );
}
