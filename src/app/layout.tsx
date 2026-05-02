import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Autoscore.ch — Les meilleures occasions auto",
  description: "Les meilleures occasions auto, analysées et sélectionnées.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
