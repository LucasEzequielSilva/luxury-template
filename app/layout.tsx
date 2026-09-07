import type { Metadata, Viewport } from "next";
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

const TITULO = "iPhones revisados con garantía en Iguazú | IPHONES LUXURY";
const DESCRIPCION =
  "iPhones sellados y usados revisados en Puerto Iguazú: 60 días de garantía, batería verificada y entrega en el día. +500 entregados. Consultá por WhatsApp.";

/* Thumbnail social estático, renderizado con la tipografía y el dorado de la
   marca. Vive en /public a propósito: las fotos del catálogo son URLs de
   Airtable que caducan a las pocas horas, y una og:image muerta deja el
   preview de WhatsApp roto para siempre. */
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "IPHONES LUXURY — iPhones revisados con garantía en Puerto Iguazú",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: TITULO,
  description: DESCRIPCION,
  applicationName: "IPHONES LUXURY",
  authors: [{ name: "IPHONES LUXURY", url: SITIO }],
  creator: "IPHONES LUXURY",
  publisher: "IPHONES LUXURY",
  category: "shopping",
  keywords: [
    "iphone usado iguazú",
    "comprar iphone en puerto iguazú",
    "iphone con garantía misiones",
    "celulares con garantía iguazú",
    "iphone sellado precio argentina",
    "iphone reacondicionado",
    "iphones luxury",
  ],
  /* iOS autolinkea como teléfono cadenas tipo "128GB" o los precios de las
     fichas; apagar la detección evita links azules falsos sobre el catálogo. */
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    /* max-image-preview:large es lo que habilita la miniatura grande en la SERP
       y en Discover; sin esto Google recorta la foto del producto a un thumb. */
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: SITIO,
    siteName: "IPHONES LUXURY",
    locale: "es_AR",
    type: "website",
    images: [OG_IMAGE],
  },
  /* Sólo la card: el objeto `twitter` de un layout se hereda ENTERO por la
     página que no lo declara, así que poner acá title/description hacía que las
     ~110 fichas compartieran el texto de la home junto a su propia foto. Sin
     esas claves Next cae al title/description resueltos de cada página (y a las
     imágenes de openGraph), y la home igual conserva los suyos porque los
     declara en metadata.title/description. */
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  /* Desde Next 15 theme-color va acá, no en metadata. Pinta la barra del
     navegador en Chrome Android del mismo negro que el sitio. */
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="scroll-smooth">
      <body className={`${soehne.className} ${soehneBreit.variable} bg-black text-slate-300 antialiased`}>
        <CurrencyProvider>{children}</CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
