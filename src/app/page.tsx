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
        unoptimized
      />
      {/* Bouton vert actif sur la carte Vendre */}
      <Link
        href="/vendre"
        className="vendre-btn"
        style={{ left: "17%", top: "69%", width: "29%", height: "5.5%" }}
        aria-label="Déposer une annonce vendeur"
      >
        Déposer une annonce
      </Link>
    </main>
  );
}
