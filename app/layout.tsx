import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CurrencyProvider from "@/components/CurrencyProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "iPhone Luxury | iPhones verificados al mejor precio",
  description:
    "iPhones seminuevos con batería al 100% y garantía de 30 días. Precios en USD, entrega en el día en CABA/GBA. iPhone 11 al 16 Pro Max.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "iPhone Luxury | iPhones verificados al mejor precio",
    description:
      "iPhones seminuevos con batería al 100% y garantía de 30 días. Precios en USD, entrega en el día en CABA/GBA.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} ${spaceGrotesk.variable} bg-black text-slate-300 antialiased`}>
        <CurrencyProvider>{children}</CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
