import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, BottomNav } from "@/components/nav";
import { RegisterSW } from "@/components/register-sw";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alex Pretti Tennis · Encordoamento",
  description:
    "Prontuário da raquete: histórico de encordoamentos, tensões, cordas, avaliações e estoque. Alex Pretti Tennis — Qualidade, Precisão, Performance.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Alex Pretti" },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RegisterSW />
        <Header />
        <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
