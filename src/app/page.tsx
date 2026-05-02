import {
  CalendarIcon,
  CarIcon,
  SearchIcon,
  ChartIcon,
  LockIcon,
  AnalyseIcon,
  SelectionIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@/components/icons";

function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {/* Speedometer gauge matching the real Autoscore logo */}
      <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background track arc (grey) */}
        <path
          d="M 15 72 A 38 38 0 1 1 85 72"
          stroke="#d1d5db"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Green filled arc (left portion) */}
        <path
          d="M 15 72 A 38 38 0 0 1 50 12"
          stroke="#3a9e5f"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Needle pointing to ~10 o'clock */}
        <line
          x1="50"
          y1="50"
          x2="24"
          y2="28"
          stroke="#1a2e3b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="50" cy="50" r="5" fill="#1a2e3b" />
      </svg>
      <div>
        <span className="text-3xl font-bold tracking-tight" style={{ color: "#1a2e3b" }}>
          Auto<span style={{ color: "#3a9e5f" }}>score</span>
        </span>
        <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-0.5">
          Les meilleures occasions auto
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.78) 0%, rgba(240,247,244,0.72) 50%, rgba(220,238,230,0.68) 100%), url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#e8f0f5",
      }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-8 text-center w-full">
        <Logo className="justify-center mb-12" />

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: "#1a2e3b" }}>
          Les meilleures{" "}
          <span style={{ color: "#3a9e5f" }}>occasions</span> auto,
          <br />
          analysées et sélectionnées
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-500 mb-10">
          Autoscore identifie et classe les meilleures opportunités du marché
          <br />
          pour vous faire gagner du temps et prendre les bonnes décisions.
        </p>

        <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-7 py-4 shadow-sm mb-14">
          <CalendarIcon className="h-6 w-6" style={{ color: "#3a9e5f" } as React.CSSProperties} />
          <div className="text-left">
            <p className="font-bold text-gray-900">Coming soon...</p>
            <p className="text-sm text-gray-400">
              Restez connecté, de grandes choses arrivent.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          <Card
            icon={<CarIcon className="h-7 w-7" />}
            title="Vendre ma voiture"
            subtitle="Publiez votre véhicule gratuitement"
            description="Touchez plus d'acheteurs qualifiés et vendez rapidement, au bon prix."
          />
          <Card
            icon={<SearchIcon className="h-7 w-7" />}
            secondaryIcon={
              <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-black flex items-center justify-center opacity-80">
                <ChartIcon className="h-8 w-8 text-white" />
              </div>
            }
            title="Trouver des occasions"
            subtitle="Accédez à des opportunités qualifiées"
            description="Des véhicules sélectionnés selon des critères clés pour acheter mieux et plus efficacement."
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  secondaryIcon,
  title,
  subtitle,
  description,
}: {
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white p-7 shadow-lg border border-gray-100 text-left overflow-hidden">
      {secondaryIcon && secondaryIcon}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "#d4ede0" }}
      >
        <div style={{ color: "#3a9e5f" }}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-1" style={{ color: "#1a2e3b" }}>{title}</h3>
      <p className="text-sm font-semibold mb-3" style={{ color: "#3a9e5f" }}>{subtitle}</p>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">{description}</p>
      <button
        disabled
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
      >
        <LockIcon className="h-4 w-4" />
        Bientôt disponible
      </button>
    </div>
  );
}

function FeaturesBar() {
  const features = [
    {
      icon: <AnalyseIcon className="h-6 w-6" />,
      title: "Analyse intelligente",
      description: "Des données fiables et actualisées pour évaluer chaque opportunité.",
    },
    {
      icon: <SelectionIcon className="h-6 w-6" />,
      title: "Sélection rigoureuse",
      description: "Uniquement les meilleures occasions selon nos critères exclusifs.",
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Gain de temps",
      description: "Fini les recherches interminables, concentrez-vous sur l'essentiel.",
    },
    {
      icon: <CheckCircleIcon className="h-6 w-6" />,
      title: "Décisions éclairées",
      description: "Des informations claires pour acheter ou vendre en toute confiance.",
    },
  ];

  return (
    <section className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-4">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#d4ede0", color: "#3a9e5f" }}
            >
              {f.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1" style={{ color: "#1a2e3b" }}>{f.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-gray-400" style={{ backgroundColor: "#1a2e3b" }}>
      © 2026{" "}
      <span className="font-bold text-white">
        Auto<span style={{ color: "#3a9e5f" }}>score</span>.ch
      </span>{" "}
      — Les meilleures occasions auto en Suisse
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <Footer />
    </>
  );
}
