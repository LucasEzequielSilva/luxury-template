import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  iphoneSpecsMap,
  formatPrice,
  textoBateria,
  tituloEquipo,
  tituloCorto,
  products as catalogoLocal,
  type Product,
} from "@/data/products";
import { getProductById, getProducts, getRelatedProducts } from "@/lib/airtable";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { ORG_ID, SITIO, type JsonLdObject } from "@/components/JsonLd";
import Breadcrumbs from "@/components/product-detail/Breadcrumbs";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductHeader from "@/components/product-detail/ProductHeader";
import ProductPricing from "@/components/product-detail/ProductPricing";
import ConditionExplainer from "@/components/product-detail/ConditionExplainer";
import WhatsAppCTA from "@/components/product-detail/WhatsAppCTA";
import TrustBadges from "@/components/product-detail/TrustBadges";
import SpecsTable from "@/components/product-detail/SpecsTable";
import ShippingInfo from "@/components/product-detail/ShippingInfo";
import WarrantyInfo from "@/components/product-detail/WarrantyInfo";
import PaymentMethods from "@/components/product-detail/PaymentMethods";
import RelatedProducts from "@/components/product-detail/RelatedProducts";
import StickyBottomBar from "@/components/product-detail/StickyBottomBar";
import ProductVariants from "@/components/product-detail/ProductVariants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const CONDICION_TEXTO: Record<Product["condition"], string> = {
  Sellado: "nuevo sellado",
  "A+": "usado grado A+",
  A: "usado grado A",
  B: "usado grado B",
  C: "usado grado C",
};

const CATEGORIA_TEXTO: Record<NonNullable<Product["category"]>, string> = {
  iphone: "Celulares > iPhone",
  android: "Celulares > Android",
  consolas: "Consolas",
};

/* La marca real sale de la primera palabra del nombre, que en el catálogo
   siempre la trae ("Samsung Galaxy A16", "Nintendo Switch OLED"). Si no
   matchea, se omite brand en vez de adivinarla. Redmi es sub-marca de Xiaomi y
   PlayStation es de Sony: eso es dato, no invento. */
const MARCAS: Record<string, string> = {
  samsung: "Samsung",
  xiaomi: "Xiaomi",
  redmi: "Xiaomi",
  motorola: "Motorola",
  nintendo: "Nintendo",
  playstation: "Sony",
  sony: "Sony",
};

/* Índice modelo+color → foto propia de /public. Las fotos que sirve Airtable
   son URLs firmadas que caducan en horas: marcarlas dejaría una imagen muerta
   en el structured data y errores recurrentes en Search Console. Se busca por
   modelo Y color para no publicar la foto de otra variante. */
const FOTOS_PROPIAS = new Map<string, string>(
  catalogoLocal.flatMap((p) => {
    const local = p.images?.find((src) => src.startsWith("/"));
    return local ? [[`${p.modelKey}|${p.color}`.toLowerCase(), local] as const] : [];
  }),
);

function fotoEstable(product: Product): string | null {
  const propia = product.images?.find((src) => src.startsWith("/"));
  const local =
    propia ?? FOTOS_PROPIAS.get(`${product.modelKey}|${product.color}`.toLowerCase());
  return local ? `${SITIO}${local}` : null;
}

/* Dos unidades del mismo modelo, capacidad y color sólo se diferencian por la
   condición: sin ella el title, el Product.name y la miga salen idénticos en
   las dos URLs y Google se queda con una sola. El sufijo se agrega únicamente
   cuando la colisión existe de verdad, para no ensuciar las fichas únicas.
   "Sellado" y "Grado A+" además son términos que la gente busca. */
const CONDICION_SUFIJO: Record<Product["condition"], string> = {
  Sellado: "Sellado",
  "A+": "Grado A+",
  A: "Grado A",
  B: "Grado B",
  C: "Grado C",
};

function claveVariante(product: Product): string {
  return `${product.modelKey}|${product.capacity}|${product.color}`.toLowerCase();
}

function sufijoCondicion(product: Product, catalogo: Product[]): string {
  const clave = claveVariante(product);
  const colisiona = catalogo.some((p) => p.id !== product.id && claveVariante(p) === clave);
  return colisiona ? ` ${CONDICION_SUFIJO[product.condition]}` : "";
}

/* Etiqueta única de la unidad: es la que identifica la entidad en el title, en
   Product.name y en la miga, así que los tres tienen que coincidir. */
function etiquetaProducto(product: Product, catalogo: Product[]): string {
  return `${tituloEquipo(product)}${sufijoCondicion(product, catalogo)}`;
}

function marcaDe(product: Product): string | null {
  if (product.category !== "android" && product.category !== "consolas") return "Apple";
  const primera = (product.modelKey || product.name).trim().split(" ")[0]?.toLowerCase() ?? "";
  return MARCAS[primera] ?? null;
}

/* El title de la ficha pelea por modelo + capacidad; la ciudad se gana desde
   la home. Candidatos de más a menos específico, se toma el primero que entre
   en 60 caracteres. Antes de perder el color se acorta la marca: el color
   distingue una ficha de otra y "IPHONES" es redundante en un título que ya
   arranca con "iPhone". La condición no se recorta nunca — es lo único que
   separa dos unidades del mismo modelo, capacidad y color. */
function tituloFicha(product: Product, catalogo: Product[]): string {
  const condicion = sufijoCondicion(product, catalogo);
  const base = tituloCorto(product);
  const completo = tituloEquipo(product);
  const candidatos = [
    `${completo}${condicion} | IPHONES LUXURY`,
    `${completo}${condicion} | LUXURY`,
    `${base}${condicion} | IPHONES LUXURY`,
    `${base}${condicion} | LUXURY`,
  ];
  return candidatos.find((t) => t.length <= 60) ?? candidatos[candidatos.length - 1];
}

function descripcionFicha(product: Product): string {
  const precio = product.price > 0 ? `${formatPrice(product.price)}.` : "Precio a confirmar.";
  const armar = (color: string, bateria: string) =>
    `${tituloCorto(product)}${color}, ${CONDICION_TEXTO[product.condition]}.${bateria} Garantía de 60 días y entrega en el día en Iguazú. ${precio} Consultá por WhatsApp.`;

  const bateria = product.batteryHealth ? ` ${textoBateria(product.batteryHealth)}.` : "";
  const completa = armar(` ${product.color}`, bateria);
  if (completa.length <= 155) return completa;
  const sinColor = armar("", bateria);
  return sinColor.length <= 155 ? sinColor : armar("", "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return {
      title: "Producto no encontrado | IPHONES LUXURY",
      robots: { index: false, follow: false },
    };
  }

  /* El catálogo entero hace falta para saber si esta unidad colisiona con otra
     igual. No es una llamada extra: getProducts() cachea en memoria y
     getProductById() ya lo pidió. */
  const catalogo = await getProducts();
  const title = tituloFicha(product, catalogo);
  const description = descripcionFicha(product);
  const ruta = `/producto/${product.id}`;

  return {
    title,
    description,
    /* Canonical propio de la ficha: sin esto hereda el de la home y Google
       descarta las ~110 fichas como duplicadas. */
    alternates: { canonical: ruta },
    openGraph: {
      title,
      description,
      /* url y siteName van repetidos acá porque este objeto reemplaza entero
         al openGraph del layout, no lo mergea campo por campo. */
      url: ruta,
      siteName: "IPHONES LUXURY",
      locale: "es_AR",
      type: "website",
      /* Apunta a la MISMA imagen que generaría la convención de archivo
         (opengraph-image.tsx), pero con URL absoluta al dominio propio: por
         convención Next la resuelve contra el host de la request, no contra
         metadataBase, así que en producción el preview saldría servido desde el
         host del deploy de Vercel mientras el canonical apunta acá. El día que
         ese deploy se rota, WhatsApp queda con un preview muerto cacheado. */
      images: [
        {
          url: `${SITIO}${ruta}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: etiquetaProducto(product, catalogo),
        },
      ],
    },
  };
}

function schemaProducto(
  product: Product,
  description: string,
  catalogo: Product[],
): JsonLdObject {
  const url = `${SITIO}/producto/${product.id}`;
  /* schema.org sólo ofrece New/Used/Refurbished/Damaged. A+ se describe como
     impecable, pero el sitio promete revisión y cambio de batería si hace
     falta, no reacondicionamiento certificado de cada unidad: va como usado y
     el grado real viaja en additionalProperty, que es donde corresponde una
     taxonomía propia. */
  const itemCondition =
    product.condition === "Sellado"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition";

  const propiedades: JsonLdObject[] = [
    { "@type": "PropertyValue", name: "Grado", value: product.condition },
    { "@type": "PropertyValue", name: "Capacidad", value: product.capacity },
  ];
  if (product.batteryHealth) {
    propiedades.push({
      "@type": "PropertyValue",
      name: "Salud de batería",
      value: product.batteryHealth,
      unitText: "%",
    });
  }

  const marca = marcaDe(product);
  const foto = fotoEstable(product);

  const schema: JsonLdObject = {
    "@type": "Product",
    "@id": `${url}#producto`,
    name: etiquetaProducto(product, catalogo),
    description,
    sku: product.id,
    color: product.color,
    category: CATEGORIA_TEXTO[product.category ?? "iphone"],
    itemCondition,
    additionalProperty: propiedades,
    ...(marca ? { brand: { "@type": "Brand", name: marca } } : {}),
    /* image es obligatoria en el rich result de producto: sin ella la ficha no
       genera resultado enriquecido y Search Console la reporta. Cuando no hay
       foto propia del modelo+color se cae a la imagen social generada, que
       existe para todo id, es estable y muestra modelo, capacidad, color,
       condición y precio de ESTA unidad — no es un placeholder genérico. */
    image: foto ?? `${url}/opengraph-image`,
  };

  /* El precio marcado va en USD y no en pesos: el ARS que ve el usuario se
     calcula con el blue del día, así que quedaría desfasado del markup apenas
     Google cachee la página — y precio marcado distinto del visible es
     justamente lo que tumba el rich result. Un producto sin precio no es una
     oferta: en ese caso se omite offers en vez de declarar InStock sin monto. */
  if (product.price > 0) {
    schema.offers = {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition,
      seller: { "@id": ORG_ID },
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: { "@type": "QuantitativeValue", value: 60, unitCode: "DAY" },
      },
      areaServed: { "@type": "City", name: "Puerto Iguazú" },
      /* Sólo efectivo: el precio marcado es el mismo que muestra
         ProductPricing, y ahí dice "precio final en efectivo, transferencia
         con recargo" (+3% en pesos, +2% en dólares según PaymentMethods).
         Declarar transferencia sobre este monto sería marcar un precio que no
         existe. Cuando se quiera marcarla, va como un Offer aparte con su
         propio price, no como método extra del mismo. */
      acceptedPaymentMethod: "http://purl.org/goodrelations/v1#Cash",
    };
  }

  return schema;
}

/* Espeja las migas visibles de Breadcrumbs.tsx. Dos niveles y no tres: el
   "Stock" intermedio apuntaba a /#inventory, que tras normalizar el fragmento
   es la misma URL que Inicio — un nivel que no describe jerarquía y que hace
   que Google colapse o ignore el trail entero. Vuelve a tres el día que
   existan rutas de categoría reales (/iphone, /android, /consolas). La hoja
   lleva la etiqueta completa para que cada URL tenga su propia miga. */
function schemaMigas(product: Product, catalogo: Product[]): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITIO}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: etiquetaProducto(product, catalogo),
      },
    ],
  };
}

/* El vendedor referenciado por offers.seller tiene que existir en ESTE
   documento: Google parsea el structured data por página y no resuelve un @id
   definido en el @graph de la home. Mismo @id que allá para no partir la
   identidad, con un subconjunto de propiedades en vez de repetir el bloque. */
const ORGANIZACION: JsonLdObject = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "IPHONES LUXURY",
  url: `${SITIO}/`,
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [allProducts, related] = await Promise.all([
    getProducts(),
    getRelatedProducts(product, 4),
  ]);

  const specs = iphoneSpecsMap[product.modelKey] ?? null;
  const datos: JsonLdObject = {
    "@context": "https://schema.org",
    "@graph": [
      schemaProducto(product, descripcionFicha(product), allProducts),
      schemaMigas(product, allProducts),
      ORGANIZACION,
    ],
  };

  return (
    <>
      <JsonLd data={datos} />
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Breadcrumbs etiqueta={etiquetaProducto(product, allProducts)} />

        {/* Two-column layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left: Gallery */}
            <ProductGallery product={product} specs={specs} />

            {/* Right: Info — sticky on desktop */}
            <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-28 lg:self-start">
              <ProductHeader product={product} />
              <ProductVariants product={product} allProducts={allProducts} />
              <ProductPricing product={product} />
              <ConditionExplainer condition={product.condition} />
              <WhatsAppCTA product={product} />
              <TrustBadges
                category={product.category}
                condition={product.condition}
                productName={product.name}
                batteryHealth={product.batteryHealth}
              />
            </div>
          </div>
        </section>

        {/* Specs */}
        {specs && <SpecsTable specs={specs} capacity={product.capacity} batteryHealth={product.batteryHealth} />}

        {/* Info panels */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-8 sm:py-10">
          <ShippingInfo />
          <WarrantyInfo condition={product.condition} />
          <PaymentMethods />
        </div>

        {/* Related */}
        <RelatedProducts related={related} allProducts={allProducts} />
      </main>
      <StickyBottomBar product={product} />
      <Footer />
    </>
  );
}
