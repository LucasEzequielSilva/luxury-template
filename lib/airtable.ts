import { products as seedProducts, type Product } from "@/data/products";

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
    colorHex: f["Color Hex"] || "#8A8A8E",
    price: f["Precio USD"],
    originalPrice: f["Precio Original USD"],
    featured: !!f.Destacado,
    category: f.Categoría || "iphone",
    batteryHealth: f["Batería %"],
    images: f.Fotos?.map((a) => a.url),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) return seedProducts;

  try {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`);
      url.searchParams.set("filterByFormula", "{Publicado}=1");
      if (offset) url.searchParams.set("offset", offset);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`Airtable ${res.status}`);

      const data = await res.json();
      records.push(...data.records);
      offset = data.offset;
    } while (offset);

    const products = records.map(recordToProduct).filter((p): p is Product => p !== null);
    return products.length > 0 ? products : seedProducts;
  } catch (err) {
    console.error("getProducts: falling back to seed data", err);
    return seedProducts;
  }
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
