/* Los ajustes que el dueño maneja desde Airtable, en la tabla "Ajustes".
   Hoy hay uno solo: la cotización del dólar. La idea es que cualquier número
   que el negocio quiera controlar viva donde ya trabaja todos los días, y no
   en una variable de entorno que solo puede tocar el estudio. */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY;
const TABLA = "Ajustes";

/* Rango de cordura para la cotización manual. No es para adivinar el precio
   "correcto" (el dueño puede querer uno bien distinto al blue), es para que un
   dedazo tipo 15 o 156000 no multiplique o divida todo el catálogo. Fuera de
   este rango se ignora el valor y se vuelve al automático. */
const MIN_COTIZACION = 100;
const MAX_COTIZACION = 100_000;

/* Los pesos que se suman al blue cuando la cotización es automática: el spread
   de financiera con el que ya venía trabajando el sitio. Vive acá y no en la
   tabla a propósito. Cuando eran dos columnas de números, una con el precio del
   dólar y otra con el ajuste, se leían como lo mismo y se cargaba el precio en
   la columna equivocada. Un solo campo visible: el precio del dólar. */
const AJUSTE_POR_DEFECTO = 20;

export interface Ajustes {
  cotizacionManual: number | null;
  ajustePorDolar: number;
}

const AJUSTES_POR_DEFECTO: Ajustes = {
  cotizacionManual: null,
  ajustePorDolar: AJUSTE_POR_DEFECTO,
};

const TTL_MS = 60_000;
let cacheado: { at: number; ajustes: Ajustes } | null = null;
let enVuelo: Promise<Ajustes> | null = null;

interface FilaAjustes {
  fields: {
    "Precio del dólar"?: number;
    /* Nombre anterior del mismo campo, por si quedó una copia de la tabla. */
    "Cotización manual"?: number;
  };
}

function numeroValido(valor: unknown, min: number, max: number): number | null {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return null;
  if (valor < min || valor > max) return null;
  return valor;
}

async function traer(): Promise<Ajustes> {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLA}`);
  url.searchParams.set("pageSize", "1");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}`);

  const data: { records?: FilaAjustes[] } = await res.json();
  const fila = data.records?.[0];
  if (!fila) return AJUSTES_POR_DEFECTO;

  const cargado = fila.fields["Precio del dólar"] ?? fila.fields["Cotización manual"];
  return {
    cotizacionManual: numeroValido(cargado, MIN_COTIZACION, MAX_COTIZACION),
    ajustePorDolar: AJUSTE_POR_DEFECTO,
  };
}

export async function getAjustes(): Promise<Ajustes> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) return AJUSTES_POR_DEFECTO;

  const ahora = Date.now();
  if (cacheado && ahora - cacheado.at < TTL_MS) return cacheado.ajustes;

  if (!enVuelo) {
    enVuelo = traer()
      .then((ajustes) => {
        cacheado = { at: Date.now(), ajustes };
        return ajustes;
      })
      /* Si la tabla no responde, la web sigue mostrando precios con el
         automático. Que falle un ajuste opcional no puede dejar el catálogo
         sin precios en pesos. */
      .catch(() => cacheado?.ajustes ?? AJUSTES_POR_DEFECTO)
      .finally(() => {
        enVuelo = null;
      });
  }

  return enVuelo;
}
