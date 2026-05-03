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
          style={{
            position: "absolute",
            left: "6.4%",
            top: "53%",
            width: "38%",
            height: "7%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "18px",
            background: "#16a34a",
            color: "#fff",
            fontWeight: 900,
            fontSize: "clamp(14px, 2vw, 28px)",
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(22, 163, 74, 0.25)",
          }}
        >
          Déposer une annonce
        </Link>
      </section>
    </main>
  );
}
