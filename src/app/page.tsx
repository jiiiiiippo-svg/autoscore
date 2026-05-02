import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative w-full min-h-screen"
      style={{
        backgroundImage: "url('/autoscore-landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="Autoscore — Coming soon"
    >
      {/* Bouton transparent positionné sur "Bientôt disponible" de la carte Vendre */}
      <Link
        href="/vendre"
        className="absolute cursor-pointer rounded-xl transition-all hover:bg-green-500/20 hover:scale-105"
        style={{
          left: "14.5%",
          top: "71%",
          width: "28%",
          height: "7%",
        }}
        aria-label="Déposer une annonce vendeur"
      />
    </main>
  );
}
