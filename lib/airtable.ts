import { products as seedProducts, type Product } from "@/data/products";
import { hexDeColor } from "./colores";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY;
const TABLE_NAME = "Productos";

interface AirtableAttachment {
  url: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    Modelo?: string;
    Categoría?: "iphone" | "android" | "consolas";
    Capacidad?: string;
    Condición?: Product["condition"];
    /* El tramo elegido en el desplegable: "80% o más", "85% o más", "90% o
       más" o "100%". Queda como alternativa: en la práctica cada fila es un
       equipo puntual y el vendedor tiene a mano el porcentaje exacto, así que
       cargar el número solo es más rápido y la web deduce el tramo. */
    "Batería"?: string;
    /* El porcentaje exacto que se lee en el equipo. Es la fuente preferida. */
    "Batería % (sin uso)"?: number;
    /* Nombre anterior del mismo campo, por si quedó algo cargado ahí. */
    "Batería %"?: number;
    Color?: string;
    "Color Hex"?: string;
    "Precio USD"?: number;
    "Precio Original USD"?: number;
    Destacado?: boolean;
    Publicado?: boolean;
    Fotos?: AirtableAttachment[];
  };
}

/* Del "85% o más" del desplegable sale el 85. Se guarda el número para que el
   resto del sitio siga comparando valores, y el texto se arma al mostrarlo. */
/* Tramos que publica la web. El negocio no vende por debajo del 80%, así que
   un número menor no tiene tramo y la ficha muestra "Batería revisada" en vez
   de un porcentaje que contradiga la promesa. */
const TRAMOS_BATERIA = [100, 90, 85, 80];

/* El panel tiene dos campos de batería: un desplegable con los tramos y el
   porcentaje exacto que el vendedor lee en el equipo. Cargar los dos es
   trabajo al pepe, así que alcanza con cualquiera de los dos y el número
   exacto manda: es el dato de origen, y siendo numérico no admite errores de
   tipeo como "%92", que en el desplegable dejaban la ficha sin batería. */
function tramoDesdeNumero(valor: unknown): number | undefined {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return TRAMOS_BATERIA.find((tramo) => n >= tramo);
}

function tramoBateria(valor: string | undefined): number | undefined {
  if (!valor) return undefined;
  const n = parseInt(valor, 10);
  return Number.isFinite(n) ? n : undefined;
}

function recordToProduct(record: AirtableRecord): Product | null {
  const f = record.fields;
  if (!f.Modelo || !f.Capacidad || !f.Condición || !f.Color || !f["Precio USD"]) return null;

  return {
    id: record.id,
    name: f.Modelo,
    modelKey: f.Modelo,
    capacity: f.Capacidad,
    condition: f.Condición,
    color: f.Color,
    /* El nombre del color manda sobre el hex cargado a mano: esa columna venía
       del catálogo de ejemplo con los tonos cruzados ("Blanco" en negro), y
       nadie que carga equipos tiene por qué corregir códigos hexadecimales.
       El hex queda de respaldo para un color que no esté en la lista. */
    colorHex: hexDeColor(f.Color) ?? f["Color Hex"] ?? "#8A8A8E",
    price: f["Precio USD"],
    originalPrice: f["Precio Original USD"],
    featured: !!f.Destacado,
    category: f.Categoría || "iphone",
    batteryHealth:
      tramoDesdeNumero(f["Batería % (sin uso)"] ?? f["Batería %"]) ??
      tramoBateria(f["Batería"]),
    images: f.Fotos?.map((a) => a.url),
  };
}

const TTL_MS = 60_000;
const REINTENTOS = 3;

/* Snapshot del último catálogo que Airtable devolvió bien. Es lo que se sirve
   si una llamada falla: caer al seed en una ficha de producto sería un 404,
   porque los IDs del seed son numéricos y los de Airtable son "rec...".

   Estas tres variables son estado de módulo: viven por proceso y las comparten
   TODAS las requests. Sirve porque el catálogo es idéntico para cualquier
   visitante. Si algún día getProducts() recibe parámetros por usuario (precios
   por cliente, stock por sucursal, algo detrás de login), este caché y `enVuelo`
   filtrarían datos de un usuario a otro: ahí hay que indexarlos por esa clave.
   Además el arreglo cacheado se devuelve por referencia, así que quien lo
   ordene o filtre tiene que copiarlo antes ([...products].sort()). */
let cacheado: { at: number; products: Product[] } | null = null;
let ultimoOk: Product[] | null = null;
let enVuelo: Promise<Product[]> | null = null;

/* El catálogo entra en dos páginas de 100 y la segunda se pide con el `offset`
   que devolvió la primera. Ese token dura segundos: cachear la respuesta con
   revalidate lo dejaba viejo y Airtable respondía 422, tumbando la carga
   entera. Por eso las páginas van sin caché y lo que se cachea es el arreglo
   ya armado, acá abajo. */
async function traerTodo(): Promise<Product[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`);
    url.searchParams.set("filterByFormula", "{Publicado}=1");
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    let res: Response | null = null;
    for (let intento = 1; intento <= REINTENTOS; intento++) {
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        cache: "no-store",
      });
      /* 429 es el límite de 5 pedidos por segundo por base, y los 5xx son
         cortes momentáneos: los dos se resuelven esperando. Un 4xx distinto es
         un problema de permisos o de fórmula y reintentarlo no cambia nada. */
      if (res.ok || (res.status !== 429 && res.status < 500)) break;
      if (intento < REINTENTOS) await new Promise((r) => setTimeout(r, 400 * intento));
    }
    if (!res || !res.ok) throw new Error(`Airtable ${res?.status ?? "sin respuesta"}`);

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records.map(recordToProduct).filter((p): p is Product => p !== null);
}

export async function getProducts(): Promise<Product[]> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) return seedProducts;

  const ahora = Date.now();
  if (cacheado && ahora - cacheado.at < TTL_MS) return cacheado.products;

  /* Una sola llamada a Airtable aunque la página pida el catálogo tres veces
     (metadata, ficha y relacionados): las demás esperan a la misma promesa. */
  if (!enVuelo) {
    enVuelo = traerTodo()
      /* Cero publicados es una respuesta legítima, no un error: puede que se
         haya vendido todo o que el dueño esté destildando para probar. Antes se
         caía al catálogo de ejemplo y la web mostraba 21 equipos que no son del
         negocio, con precios que no son los suyos. Ahora se sirve el vacío y
         cada sección muestra su estado de "sin stock". */
      .then((products) => {
        cacheado = { at: Date.now(), products };
        ultimoOk = products;
        return products;
      })
      .catch((err) => {
        console.error("getProducts: Airtable falló, sirvo lo último bueno", err);
        return ultimoOk ?? cacheado?.products ?? seedProducts;
      })
      .finally(() => {
        enVuelo = null;
      });
  }

  return enVuelo;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aScore =
        (a.modelKey === product.modelKey ? 2 : 0) + (a.condition === product.condition ? 1 : 0);
      const bScore =
        (b.modelKey === product.modelKey ? 2 : 0) + (b.condition === product.condition ? 1 : 0);
      if (bScore !== aScore) return bScore - aScore;
      return Math.abs(a.price - product.price) - Math.abs(b.price - product.price);
    })
    .slice(0, limit);
}
