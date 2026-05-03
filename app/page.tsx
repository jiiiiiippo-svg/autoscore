import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Full landing image — natural aspect ratio, nothing cropped */}
      <main className="w-full pb-24">
        <Image
          src="/autoscore-landing.png"
          alt="Autoscore — Les meilleures occasions auto"
          width={1536}
          height={1024}
          className="w-full h-auto block"
          priority
        />
      </main>

      {/* Fixed CTA bar — always visible at the bottom of the screen */}
      <div className="fixed bottom-0 left-0 right-0 z-50
                      bg-white/95 backdrop-blur-sm border-t border-gray-200
                      shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
                      px-4 py-3 flex flex-row gap-3 justify-center items-center">

        <Link
          href="/score"
          className="inline-flex items-center justify-center rounded-xl
                     bg-[#1b6b3a] hover:bg-[#155530] active:bg-[#0f4025]
                     text-white font-semibold px-8 py-3 text-base
                     shadow-md transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Déposer une annonce
        </Link>

        <button
          disabled
          aria-disabled="true"
          className="inline-flex items-center justify-center rounded-xl
                     bg-gray-100 text-gray-400 font-semibold
                     px-8 py-3 text-base
                     cursor-not-allowed select-none"
        >
          Bientôt disponible
        </button>
      </div>
    </>
  );
}
