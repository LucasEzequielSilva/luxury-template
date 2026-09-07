import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IPHONES LUXURY",
    short_name: "LUXURY",
    description:
      "iPhones sellados y usados revisados en Puerto Iguazú: 60 días de garantía, batería verificada y entrega en el día.",
    start_url: "/",
    /* standalone y no fullscreen: el sitio se navega, no es un juego, y en
       standalone el usuario conserva la barra de estado del sistema. */
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    lang: "es-AR",
    /* Solo los dos íconos que existen en /public, con sus dimensiones reales
       verificadas (192x192 y 180x180). No se declara un 512x512 porque no hay
       ninguno de ese tamaño: el único asset grande es logo-icon.png, de
       1495x1495 y 666 KB, demasiado pesado para servirlo como ícono. Mientras
       no exista un 512 optimizado, Chrome no va a ofrecer "instalar app", que
       es un costo menor frente a declarar un tamaño falso. */
    icons: [
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
