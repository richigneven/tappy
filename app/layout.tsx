import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getServerLocale } from "@/lib/i18n/server";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tappy – Kneipen in deiner Nähe",
  description: "Finde, trage ein und bewerte Kneipen in deiner Umgebung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getServerLocale();

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-bar-950 text-cream font-body min-h-screen flex flex-col">
        <LocaleProvider initialLocale={locale}>
          <Navbar />
          <main className="flex-1">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
