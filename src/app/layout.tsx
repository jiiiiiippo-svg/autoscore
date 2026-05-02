import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Autoscore.ch — Les meilleures occasions auto en Suisse",
  description:
    "Autoscore identifie et classe les meilleures opportunités du marché automobile suisse pour vous faire gagner du temps et prendre les bonnes décisions.",
  openGraph: {
    title: "Autoscore.ch — Les meilleures occasions auto en Suisse",
    description:
      "Autoscore identifie et classe les meilleures opportunités du marché automobile suisse.",
    locale: "fr_CH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
