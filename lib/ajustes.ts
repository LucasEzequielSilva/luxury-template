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

/* El ajuste que se suma al blue cuando la cotización es automática. Es el
   spread de financiera que ya estaba escrito en el código; ahora es el valor
   por defecto y el dueño lo puede cambiar desde la tabla. */
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
    "Cotización manual"?: number;
    "Ajuste por dólar"?: number;
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

  return {
    cotizacionManual: numeroValido(fila.fields["Cotización manual"], MIN_COTIZACION, MAX_COTIZACION),
    /* El ajuste sí puede ser 0 (vender al blue pelado) y puede ser negativo si
       alguna vez quiere vender por debajo, así que solo se acota el disparate. */
    ajustePorDolar: numeroValido(fila.fields["Ajuste por dólar"], -10_000, 10_000) ?? AJUSTE_POR_DEFECTO,
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
