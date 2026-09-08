import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getProductById } from "@/lib/airtable";
import { formatPrice, textoBateria, tituloCorto } from "@/data/products";

/* El catálogo sale de Airtable con caché de 60s: la imagen se arma en cada
   pedido para que el precio del preview no quede viejo. */
export const dynamic = "force-dynamic";

export const alt = "IPHONES LUXURY";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NEGRO = "#0b0b0b";
const DORADO = "#d4a843";
const GRAD_DORADO =
  "linear-gradient(289deg, #fef48a 0%, #cfa534 20%, #ba810c 49%, #ddba4c 66%, #fef48a 76%, #ca9b28 86%)";

const CONDICION_TEXTO: Record<string, string> = {
  Sellado: "Nuevo sellado",
  "A+": "Usado grado A+",
  A: "Usado grado A",
};

/* Satori no reflowea ni encoge el texto: si el título no entra, se corta. Los
   tramos están calibrados contra los 1052px útiles del canvas, con el peor caso
   del catálogo ("iPhone 17 Pro Max 512GB", 23 caracteres). */
function tamanoTitulo(texto: string): number {
  if (texto.length <= 16) return 94;
  if (texto.length <= 22) return 76;
  if (texto.length <= 30) return 64;
  return 52;
}

/* El emblema se lee del disco y se inyecta como data URI: satori no resuelve
   rutas relativas de /public. Es la versión chica ya compuesta sobre el negro
   de marca, no el logo-icon.png de 666 KB. */
let emblemaCache: string | null = null;
async function getEmblema(): Promise<string> {
  if (!emblemaCache) {
    const buf = await readFile(path.join(process.cwd(), "public", "og-emblem.png"));
    emblemaCache = `data:image/png;base64,${buf.toString("base64")}`;
  }
  return emblemaCache;
}

/* Sin fotos del producto a propósito: las imágenes del catálogo son URLs de
   Airtable que caducan a las pocas horas y dejarían el preview roto. La
   tipografía tampoco es Söhne porque satori no lee .woff2. */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, emblema] = await Promise.all([getProductById(id), getEmblema()]);

  const titulo = product ? tituloCorto(product) : "iPhones revisados";
  const subtitulo = product ? product.color : "con 60 días de garantía";
  /* price 0 es el "Consultar precio" de la UI; imprimir "US$0" sería peor que
     no poner nada. Sin producto (ID inválido) directamente no hay precio. */
  const precio = !product ? "" : product.price > 0 ? formatPrice(product.price) : "Consultar precio";

  const chips: string[] = [];
  if (product) {
    chips.push(CONDICION_TEXTO[product.condition] ?? product.condition);
    if (product.batteryHealth) chips.push(textoBateria(product.batteryHealth));
    chips.push("60 días de garantía");
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NEGRO,
          padding: "58px 74px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: GRAD_DORADO }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: GRAD_DORADO }} />

        {/* Absoluto para que no empuje el bloque central hacia arriba. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblema} alt="" width={168} height={168} style={{ position: "absolute", top: 34, right: 58 }} />

        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 6, color: DORADO }}>
          IPHONES LUXURY
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: tamanoTitulo(titulo),
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {titulo}
          </div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 40, color: "#a6a6a6" }}>{subtitulo}</div>

          {chips.length > 0 && (
            <div style={{ display: "flex", marginTop: 30, gap: 14 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "10px 22px",
                    borderRadius: 999,
                    border: `2px solid rgba(212,168,67,0.45)`,
                    color: DORADO,
                    fontSize: 26,
                    fontWeight: 600,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 800, color: DORADO, letterSpacing: -2 }}>
            {precio}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8a8a8a", paddingBottom: 14 }}>
            Puerto Iguazú · Entrega en el día
          </div>
        </div>
      </div>
    ),
    size,
  );
}
