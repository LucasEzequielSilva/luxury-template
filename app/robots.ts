import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Las rutas de /api devuelven JSON (cotización del blue y reseñas): no
         son páginas, no rankean y solo gastan presupuesto de rastreo.
         /cotizador NO se bloquea a propósito aunque la feature esté apagada:
         la página se saca del índice con <meta robots noindex>, y para que
         Google lea ese noindex primero tiene que poder rastrearla. Bloquearla
         acá dejaría la URL indexable sin contenido, que es peor. */
      disallow: ["/api/"],
    },
    sitemap: `${SITIO}/sitemap.xml`,
    host: SITIO,
  };
}
