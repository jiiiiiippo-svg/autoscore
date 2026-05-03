/**
 * Toutes les marques disponibles sur AutoScout24.ch
 * Format URL : https://www.autoscout24.ch/lst/[SLUG]
 * Scraping par marque (sans filtre modèle) = tous les modèles capturés
 */

export const AUTOSCOUT24_BRANDS: { name: string; slug: string }[] = [
  // ── Volume / Grand public ──────────────────────────────
  { name: "Volkswagen",     slug: "volkswagen" },
  { name: "BMW",            slug: "bmw" },
  { name: "Mercedes-Benz",  slug: "mercedes-benz" },
  { name: "Audi",           slug: "audi" },
  { name: "Toyota",         slug: "toyota" },
  { name: "Renault",        slug: "renault" },
  { name: "Peugeot",        slug: "peugeot" },
  { name: "Ford",           slug: "ford" },
  { name: "Opel",           slug: "opel" },
  { name: "Skoda",          slug: "skoda" },
  { name: "Seat",           slug: "seat" },
  { name: "Citroën",        slug: "citroen" },
  { name: "Fiat",           slug: "fiat" },
  { name: "Hyundai",        slug: "hyundai" },
  { name: "Kia",            slug: "kia" },
  { name: "Dacia",          slug: "dacia" },
  { name: "Nissan",         slug: "nissan" },
  { name: "Honda",          slug: "honda" },
  { name: "Mazda",          slug: "mazda" },
  { name: "Mitsubishi",     slug: "mitsubishi" },
  { name: "Suzuki",         slug: "suzuki" },
  { name: "Subaru",         slug: "subaru" },
  { name: "Volvo",          slug: "volvo" },
  { name: "Mini",           slug: "mini" },
  { name: "Tesla",          slug: "tesla" },
  { name: "Jeep",           slug: "jeep" },
  { name: "Land Rover",     slug: "land-rover" },
  { name: "Lexus",          slug: "lexus" },
  { name: "Alfa Romeo",     slug: "alfa-romeo" },
  { name: "Lancia",         slug: "lancia" },
  { name: "DS",             slug: "ds-automobiles" },
  { name: "Cupra",          slug: "cupra" },
  { name: "MG",             slug: "mg" },
  { name: "BYD",            slug: "byd" },
  { name: "Polestar",       slug: "polestar" },
  { name: "Smart",          slug: "smart" },
  { name: "Lynk & Co",      slug: "lynk-co" },
  { name: "Genesis",        slug: "genesis" },

  // ── Premium / Sport ───────────────────────────────────
  { name: "Porsche",        slug: "porsche" },
  { name: "Maserati",       slug: "maserati" },
  { name: "Jaguar",         slug: "jaguar" },
  { name: "Bentley",        slug: "bentley" },
  { name: "Rolls-Royce",    slug: "rolls-royce" },
  { name: "Aston Martin",   slug: "aston-martin" },
  { name: "Ferrari",        slug: "ferrari" },
  { name: "Lamborghini",    slug: "lamborghini" },
  { name: "McLaren",        slug: "mclaren" },
  { name: "Lotus",          slug: "lotus" },
  { name: "Alpine",         slug: "alpine" },
  { name: "Abarth",         slug: "abarth" },

  // ── Américaines ───────────────────────────────────────
  { name: "Chevrolet",      slug: "chevrolet" },
  { name: "Dodge",          slug: "dodge" },
  { name: "Cadillac",       slug: "cadillac" },
  { name: "Chrysler",       slug: "chrysler" },

  // ── Utilitaires & SUV ─────────────────────────────────
  { name: "Isuzu",          slug: "isuzu" },
  { name: "SsangYong",      slug: "ssangyong" },
  { name: "Daihatsu",       slug: "daihatsu" },
  { name: "Infiniti",       slug: "infiniti" },
  { name: "Acura",          slug: "acura" },

  // ── Électriques émergentes ────────────────────────────
  { name: "Rivian",         slug: "rivian" },
  { name: "Lucid",          slug: "lucid" },
  { name: "Aiways",         slug: "aiways" },
  { name: "Ora",            slug: "ora" },
  { name: "Nio",            slug: "nio" },
  { name: "XPENG",          slug: "xpeng" },
];

/**
 * Génère les URLs AutoScout24.ch pour toutes les marques.
 * Chaque URL scrape tous les modèles de la marque (pas de filtre modèle).
 * Paramètres : CH uniquement, voitures seulement, tri par date
 */
export function buildAllBrandUrls(): { url: string }[] {
  return AUTOSCOUT24_BRANDS.map(({ slug }) => ({
    url: `https://www.autoscout24.ch/lst/${slug}?cy=CH&atype=C&sort=age&desc=0`,
  }));
}

export const TOTAL_BRANDS = AUTOSCOUT24_BRANDS.length;
