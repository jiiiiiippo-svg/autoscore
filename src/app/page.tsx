import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-full" aria-label="Autoscore — Coming soon">
      <Image
        src="/autoscore-landing.png"
        alt="Autoscore — Les meilleures occasions auto en Suisse"
        width={1536}
        height={1024}
        className="w-full h-auto block"
        priority
        quality={100}
      />
      {/* Bouton transparent sur "Bientôt disponible" carte Vendre */}
      <Link
        href="/vendre"
        className="absolute rounded-xl transition-all hover:bg-green-500/20"
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
