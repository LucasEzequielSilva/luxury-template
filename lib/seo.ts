/* Dominio canónico del sitio. Vive acá y no en app/layout.tsx porque robots,
   sitemap y manifest necesitan URLs absolutas y no pueden importar el metadata
   del layout sin arrastrar las fuentes y el provider de moneda. */
export const SITIO = "https://iphonesluxury.com.ar";
