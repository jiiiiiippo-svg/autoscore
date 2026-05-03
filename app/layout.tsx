import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Autoscore.ch — Les meilleures occasions auto",
  description: "Les meilleures occasions auto, analysées et sélectionnées.",
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
