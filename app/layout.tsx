import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import CurrencyProvider from "@/components/CurrencyProvider";
import "./globals.css";

const soehne = localFont({
  src: [
    { path: "./fonts/soehne_buch-s.p.2faoiug7xav04.woff2", weight: "400", style: "normal" },
    { path: "./fonts/soehne_buch_kursiv-s.p.2olvm13bchd_3.woff2", weight: "400", style: "italic" },
    { path: "./fonts/soehne_halbfett-s.p.0cjwyfhpx35x7.woff2", weight: "600", style: "normal" },
    { path: "./fonts/soehne_dreiviertelfett-s.p.3afamixnanxop.woff2", weight: "700", style: "normal" },
    { path: "./fonts/soehne_extrafett-s.p.237as54tdb2in.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-soehne",
});

const soehneBreit = localFont({
  src: "./fonts/soehne_breit_extrafett-s.p.3us7o9sn4w6yj.woff2",
  weight: "800",
  variable: "--font-soehne-breit",
});

/* El dominio propio. Sin metadataBase, Next resuelve las URLs relativas de
   Open Graph contra localhost en dev y contra la URL del deploy en prod, así
   que la miniatura que ve WhatsApp cambiaba en cada deploy. Con esto queda
   fija y el canonical apunta siempre al dominio del cliente. */
const SITIO = "https://iphonesluxury.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: "IPHONES LUXURY | iPhones revisados con garantía en Iguazú",
  description:
    "iPhones revisados, con 60 días de garantía y entrega en el día en Puerto Iguazú. Más de 500 equipos vendidos. Consultá el stock por WhatsApp.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "IPHONES LUXURY | iPhones revisados con garantía en Iguazú",
    description:
      "iPhones revisados, con 60 días de garantía y entrega en el día en Puerto Iguazú. Más de 500 equipos vendidos. Consultá el stock por WhatsApp.",
    url: SITIO,
    siteName: "IPHONES LUXURY",
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
      <body className={`${soehne.className} ${soehneBreit.variable} bg-black text-slate-300 antialiased`}>
        <CurrencyProvider>{children}</CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
