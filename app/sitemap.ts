import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/airtable";
import { SITIO } from "@/lib/seo";

/* Mismo criterio que el resto del sitio (app/page.tsx y la ficha son
   force-dynamic): el catálogo vive en Airtable, cambia varias veces por semana
   y las fichas se publican y despublican a mano. Un sitemap estático generado
   en build quedaría congelado con el stock del último deploy y le estaría
   ofreciendo a Google URLs de productos ya vendidos. Además getProducts() usa
   fetch con cache "no-store" para paginar Airtable (el token de `offset`
   caduca en segundos), así que declarar revalidate acá sería una configuración
   de caché contradictoria. El costo de ser dinámico es bajo: getProducts()
   cachea el catálogo 60s en memoria y un sitemap se pide muy de vez en cuando. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Fecha truncada al día: no tenemos campo de "última modificación" en
     Airtable, y poner el timestamp exacto de la request haría que el lastmod
     cambiara en cada rastreo, que es justo la señal que Google aprende a
     ignorar. A nivel día refleja la verdad operativa (precios y stock se tocan
     a diario) y se mantiene estable entre pedidos del mismo día. */
  const hoy = new Date(new Date().toDateString());

  const home: MetadataRoute.Sitemap = [
    {
      url: SITIO,
      lastModified: hoy,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  let productos: MetadataRoute.Sitemap = [];

  try {
    const products = await getProducts();

    /* Solo IDs de Airtable. Si Airtable no responde y no hay nada cacheado,
       getProducts() cae al seed de data/products.ts, cuyos IDs son numéricos y
       no resuelven en /producto/[id]: publicarlos sería llenar el sitemap de
       404. Con este filtro, el peor caso es un sitemap con la sola home. */
    productos = products
      .filter((p) => p.id.startsWith("rec"))
      .map((p) => ({
        url: `${SITIO}/producto/${p.id}`,
        lastModified: hoy,
        /* El contenido de la ficha (precio en USD, condición, batería) se
           actualiza junto con el catálogo, pero cada unidad individual cambia
           menos que la home, que además muestra la grilla entera. */
        changeFrequency: "weekly" as const,
        /* Los destacados son los que el negocio empuja y los que ya reciben
           links internos desde Featured; el resto del catálogo va un escalón
           abajo. Nada por encima de la home. */
        priority: p.featured ? 0.8 : 0.6,
      }));
  } catch (err) {
    /* getProducts() ya atrapa sus propios errores, pero el sitemap es una ruta
       que Google pide sola: si algo inesperado explota acá, preferimos servir
       un sitemap válido con la home antes que un 500, que Search Console
       registra como "sitemap no se pudo leer". */
    console.error("sitemap: no se pudo listar el catálogo, sirvo solo la home", err);
  }

  /* /cotizador queda deliberadamente afuera: la feature de Plan Canje está
     deshabilitada y la página va con noindex. Cuando se reactive, se vuelve a
     linkear desde el Footer y se suma acá. */
  return [...home, ...productos];
}
