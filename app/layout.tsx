import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Autoscore.ch — Scorez votre voiture en 30 secondes",
  description: "Autoscore calcule l’attractivité de votre véhicule et le rend visible auprès de garages partenaires. Gratuit, rapide, sans spam.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
