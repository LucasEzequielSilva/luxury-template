const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY;
/* En la URL va el nombre y no el id de la tabla (tblFEqnTf3cFlkV8X): si el
   dueño renombra la tabla habría que tocar código, pero el nombre es el que
   ve él en Airtable y hace obvio qué se está leyendo. */
const TABLE_NAME = "Reseñas";

export interface Resena {
  id: string;
  nombre: string;
  equipo: string;
  estrellas: number;
  comentario: string;
  /* ISO YYYY-MM-DD, para que el cliente la formatee sin depender de la zona
     horaria del servidor. */
  fecha: string;
}

export interface NuevaResena {
  nombre: string;
  equipo: string;
  estrellas: number;
  comentario: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    Nombre?: string;
    Estrellas?: number;
    Comentario?: string;
    Equipo?: string;
    Publicada?: boolean;
    Fecha?: string;
  };
}

function recordToResena(record: AirtableRecord): Resena | null {
  const f = record.fields;
  /* Sin nombre o sin puntaje la fila está a medio cargar y no se muestra. */
  if (!f.Nombre || !f.Estrellas) return null;

  return {
    id: record.id,
    nombre: f.Nombre,
    equipo: f.Equipo ?? "",
    /* Airtable acepta cualquier número; se recorta a 1-5 para que el
       renderizado de estrellas no tenga que defenderse. */
    estrellas: Math.min(5, Math.max(1, Math.round(f.Estrellas))),
    comentario: f.Comentario ?? "",
    fecha: (f.Fecha ?? "").slice(0, 10),
  };
}

const TTL_MS = 60_000;
const REINTENTOS = 3;

/* Mismo esquema que lib/airtable.ts: estado de módulo compartido por todas las
   requests del proceso. Sirve porque las reseñas publicadas son idénticas para
   cualquier visitante; si algún día se filtraran por usuario habría que
   indexar el caché por esa clave. El arreglo se devuelve por referencia, así
   que quien lo ordene o filtre tiene que copiarlo antes. */
let cacheado: { at: number; resenas: Resena[] } | null = null;
let ultimoOk: Resena[] | null = null;
let enVuelo: Promise<Resena[]> | null = null;

/* Las páginas se piden con el `offset` que devolvió la anterior y ese token
   dura segundos: cachear la respuesta HTTP lo dejaría viejo y Airtable
   respondería 422. Por eso el fetch va sin caché y lo que se cachea es el
   arreglo ya armado. */
async function traerTodo(): Promise<Resena[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`);
    url.searchParams.set("filterByFormula", "{Publicada}=1");
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    let res: Response | null = null;
    for (let intento = 1; intento <= REINTENTOS; intento++) {
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        cache: "no-store",
      });
      /* 429 es el límite de 5 pedidos por segundo por base y los 5xx son
         cortes momentáneos: los dos se resuelven esperando. Otro 4xx es un
         problema de permisos o de fórmula y reintentarlo no cambia nada. */
      if (res.ok || (res.status !== 429 && res.status < 500)) break;
      if (intento < REINTENTOS) await new Promise((r) => setTimeout(r, 400 * intento));
    }
    if (!res || !res.ok) throw new Error(`Airtable ${res?.status ?? "sin respuesta"}`);

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records
    .map(recordToResena)
    .filter((r): r is Resena => r !== null)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function getResenas(): Promise<Resena[]> {
  /* Sin credenciales la sección tiene que verse igual que sin reseñas: vacía
     e invitando a dejar la primera, nunca rota. */
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) return [];

  const ahora = Date.now();
  if (cacheado && ahora - cacheado.at < TTL_MS) return cacheado.resenas;

  if (!enVuelo) {
    enVuelo = traerTodo()
      .then((resenas) => {
        cacheado = { at: Date.now(), resenas };
        ultimoOk = resenas;
        return resenas;
      })
      .catch((err) => {
        console.error("getResenas: Airtable falló, sirvo lo último bueno", err);
        return ultimoOk ?? cacheado?.resenas ?? [];
      })
      .finally(() => {
        enVuelo = null;
      });
  }

  return enVuelo;
}

/* Se llama después de crear una reseña para que el dueño vea el efecto apenas
   la tilde en Airtable, sin esperar a que venza el TTL. */
export function invalidarCacheResenas(): void {
  cacheado = null;
}

/* toISOString() da UTC y el servidor puede estar en cualquier zona: una reseña
   dejada a las 21:30 de Argentina (UTC-3) se guardaría con la fecha del día
   siguiente. "en-CA" ya formatea como YYYY-MM-DD, que es lo que espera el
   campo Fecha de Airtable y lo que ordena y muestra el resto del código. */
function fechaDeHoyEnArgentina(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}

export async function crearResena(datos: NuevaResena): Promise<void> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) {
    throw new Error("Faltan AIRTABLE_BASE_ID o AIRTABLE_API_KEY: no se puede guardar la reseña.");
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
  const body = JSON.stringify({
    fields: {
      Nombre: datos.nombre,
      Equipo: datos.equipo,
      Estrellas: datos.estrellas,
      Comentario: datos.comentario,
      /* Publicada queda sin tildar a propósito: nada llega a la web hasta que
         el dueño la aprueba desde Airtable. */
      Publicada: false,
      Fecha: fechaDeHoyEnArgentina(),
    },
  });

  let res: Response | null = null;
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });
    if (res.ok || (res.status !== 429 && res.status < 500)) break;
    if (intento < REINTENTOS) await new Promise((r) => setTimeout(r, 400 * intento));
  }
  if (!res || !res.ok) throw new Error(`Airtable ${res?.status ?? "sin respuesta"} al crear la reseña`);

  invalidarCacheResenas();
}
