export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QualityGallery from "@/components/QualityGallery";
import Featured from "@/components/Featured";
import Inventory from "@/components/Inventory";
import Warranty from "@/components/Warranty";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
// Cotizador / plan canje: lógica aparte, deshabilitada por ahora
// import TradeInBanner from "@/components/TradeInBanner";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HomeClient from "@/components/HomeClient";
import JsonLd, { ORG_ID, SITIO, type JsonLdObject } from "@/components/JsonLd";
import { getProducts } from "@/lib/airtable";

/* Canonical declarado en la página y no sólo en el layout: el del layout lo
   hereda toda página hija que no lo pise, así que dejarlo únicamente ahí hacía
   que las fichas se declararan duplicados de la home. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const DESCRIPCION_NEGOCIO =
  "iPhones sellados y usados revisados en Puerto Iguazú: 60 días de garantía, batería verificada y entrega en el día. +500 entregados. Consultá por WhatsApp.";

/* Organization y no LocalBusiness/Store: todos los tipos locales se apoyan en
   address y openingHoursSpecification, y acá no hay ni local a la calle ni
   horario definido — el punto de encuentro se coordina por WhatsApp. Inventar
   una dirección para habilitar el rich result local sería dato falso y además
   chocaría con la ficha de Google Business el día que se cree. areaServed dice
   la verdad sobre el radio de operación sin inventar nada.
   Ruta de upgrade cuando exista ficha + punto fijo: @type MobilePhoneStore,
   sumar address, openingHoursSpecification, geo y el perfil de Google a sameAs. */
const negocio: JsonLdObject = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "IPHONES LUXURY",
      url: `${SITIO}/`,
      description: DESCRIPCION_NEGOCIO,
      logo: {
        "@type": "ImageObject",
        url: `${SITIO}/logo.png`,
        width: 4280,
        height: 1396,
      },
      image: `${SITIO}/og.png`,
      /* El 9 después del +54 no es un typo: en E.164 los móviles argentinos lo
         llevan (+54 9 3757 541930). Sin él queda declarado como fijo del área
         3757 y el click-to-call de la SERP marca un número que no es este. */
      telephone: "+5493757541930",
      sameAs: [
        "https://www.instagram.com/iphonesluxury/",
        "https://wa.me/3757541930",
      ],
      areaServed: {
        "@type": "City",
        name: "Puerto Iguazú",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Misiones",
          containedInPlace: { "@type": "Country", name: "AR" },
        },
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+5493757541930",
        availableLanguage: "es-AR",
        areaServed: "AR",
      },
      knowsLanguage: "es-AR",
    },
    {
      "@type": "WebSite",
      "@id": `${SITIO}/#sitio`,
      url: `${SITIO}/`,
      name: "IPHONES LUXURY",
      inLanguage: "es-AR",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default async function Home() {
  const products = await getProducts();
  /* Destacados es la única sección de fondo negro entre Calidad y Stock, que
     son las dos grises. Si no hay ningún equipo destacado no se dibuja, y sin
     ella los divisores de esas dos secciones se cruzan. */
  const hayDestacados = products.some((p) => p.featured);

  return (
    <>
      {/* Fuera del HomeClient: ese wrapper arranca con opacity 0 hasta que
          corre el JS del loader y el markup no depende del cliente. */}
      <JsonLd data={negocio} />
      <HomeClient>
        <Navbar />
        <Hero products={products} />
        <QualityGallery products={products} conDivisorInferior={hayDestacados} />
        <Featured products={products} />
        <Inventory products={products} conDivisorSuperior={hayDestacados} />
        <Warranty />
        <Reviews />
        <Location />
        {/* <TradeInBanner /> */}
        <Footer />
        <WhatsAppFloat />
      </HomeClient>
    </>
  );
}
