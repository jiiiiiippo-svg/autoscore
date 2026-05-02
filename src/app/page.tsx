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
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke="#e5e7eb"
          strokeWidth="5"
          fill="none"
        />
        <path
          d="M 8 38 A 24 24 0 1 1 48 38"
          stroke="#2e8b57"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1="28"
          y1="28"
          x2="38"
          y2="14"
          stroke="#2e8b57"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="28" cy="28" r="3" fill="#2e8b57" />
      </svg>
      <div>
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          Auto<span className="text-green-brand">score</span>
        </span>
        <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-500 uppercase">
          Les meilleures occasions auto
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.75) 100%), url('/hero-bg.jpg')",
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-8 text-center">
        <Logo className="justify-center mb-10" />

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
          Les meilleures{" "}
          <span className="text-green-brand">occasions</span> auto,
          <br />
          analysées et sélectionnées
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-10">
          Autoscore identifie et classe les meilleures opportunités du marché
          pour vous faire gagner du temps et prendre les bonnes décisions.
        </p>

        <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm mb-12">
          <CalendarIcon className="h-6 w-6 text-green-brand" />
          <div className="text-left">
            <p className="font-bold text-gray-900">Coming soon...</p>
            <p className="text-sm text-gray-500">
              Restez connecté, de grandes choses arrivent.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          <Card
            icon={<CarIcon className="h-8 w-8 text-green-brand" />}
            title="Vendre ma voiture"
            subtitle="Publiez votre véhicule gratuitement"
            description="Touchez plus d'acheteurs qualifiés et vendez rapidement, au bon prix."
          />
          <Card
            icon={<SearchIcon className="h-8 w-8 text-green-brand" />}
            secondaryIcon={<ChartIcon className="h-10 w-10 text-green-brand opacity-30" />}
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
    <div className="relative rounded-2xl bg-white p-6 shadow-lg border border-gray-100 text-left overflow-hidden">
      {secondaryIcon && (
        <div className="absolute right-4 top-4">{secondaryIcon}</div>
      )}
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-semibold text-green-brand mb-2">{subtitle}</p>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
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
      icon: <AnalyseIcon className="h-8 w-8 text-green-brand" />,
      title: "Analyse intelligente",
      description:
        "Des données fiables et actualisées pour évaluer chaque opportunité.",
    },
    {
      icon: <SelectionIcon className="h-8 w-8 text-green-brand" />,
      title: "Sélection rigoureuse",
      description:
        "Uniquement les meilleures occasions selon nos critères exclusifs.",
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-green-brand" />,
      title: "Gain de temps",
      description:
        "Fini les recherches interminables, concentrez-vous sur l'essentiel.",
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8 text-green-brand" />,
      title: "Décisions éclairées",
      description:
        "Des informations claires pour acheter ou vendre en toute confiance.",
    },
  ];

  return (
    <section className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <div className="shrink-0">{f.icon}</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                {f.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400">
      © 2026 <span className="font-bold text-white">Autoscore.ch</span> — Les
      meilleures occasions auto en Suisse
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
