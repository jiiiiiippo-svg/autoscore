import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* Full landing image — renders at natural aspect ratio so nothing is cropped */}
      <div className="relative w-full">
        <Image
          src="/autoscore-landing.png"
          alt="Autoscore — Les meilleures occasions auto"
          width={1536}
          height={1024}
          className="w-full h-auto block"
          priority
        />

        {/* Overlay CTA buttons — positioned over the card action rows at ~83% image height.
            Horizontal padding aligns with the two cards in the design (≈21% each side). */}
        <div
          className="absolute left-0 right-0 flex flex-row gap-[2.5%]"
          style={{ top: "83%", paddingLeft: "21%", paddingRight: "21%" }}
        >
          {/* LEFT — active, links to /score */}
          <Link
            href="/score"
            className="flex-1 inline-flex items-center justify-center rounded-xl
                       bg-[#1b6b3a] hover:bg-[#155530] text-white font-semibold
                       py-[1.8%] px-2 text-center leading-tight
                       shadow-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-green-400"
            style={{ fontSize: "clamp(11px, 1.1vw, 17px)" }}
          >
            Déposer une annonce
          </Link>

          {/* RIGHT — disabled */}
          <button
            disabled
            aria-disabled="true"
            className="flex-1 inline-flex items-center justify-center rounded-xl
                       bg-gray-200 text-gray-400 font-semibold
                       py-[1.8%] px-2 text-center leading-tight
                       shadow cursor-not-allowed select-none"
            style={{ fontSize: "clamp(11px, 1.1vw, 17px)" }}
          >
            Bientôt disponible
          </button>
        </div>
      </div>
    </main>
  );
}
