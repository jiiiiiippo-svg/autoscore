import Link from "next/link";

export default function Home() {
  return (
    <main
      aria-label="Autoscore — Les meilleures occasions auto"
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: "url('/autoscore-landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay action buttons — positioned in the lower half of the landing image
          matching the two-card layout visible in the design */}
      <div className="absolute inset-0 flex items-end justify-center pb-[10%]">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 px-6 w-full max-w-2xl justify-center">

          {/* LEFT CARD — Déposer une annonce (active) */}
          <Link
            href="/score"
            className="flex-1 min-w-0 inline-flex items-center justify-center
                       rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60
                       px-5 py-4 text-center font-semibold text-gray-900 text-base sm:text-lg
                       shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Déposer une annonce
          </Link>

          {/* RIGHT CARD — Bientôt disponible (disabled) */}
          <button
            disabled
            aria-disabled="true"
            className="flex-1 min-w-0 inline-flex items-center justify-center
                       rounded-2xl bg-white/50 backdrop-blur-sm border border-white/40
                       px-5 py-4 text-center font-semibold text-gray-400 text-base sm:text-lg
                       shadow cursor-not-allowed select-none"
          >
            Bientôt disponible
          </button>

        </div>
      </div>
    </main>
  );
}
