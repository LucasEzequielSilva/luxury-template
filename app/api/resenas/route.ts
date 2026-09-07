import { NextResponse } from "next/server";
import { crearResena, getResenas } from "@/lib/resenas";

export const dynamic = "force-dynamic";

export async function GET() {
  /* getResenas ya absorbe los errores de Airtable y devuelve lista vacía, así
     que la sección nunca recibe un 500 que la deje rota. */
  const resenas = await getResenas();
  const total = resenas.length;
  const promedio =
    total > 0
      ? Math.round((resenas.reduce((suma, r) => suma + r.estrellas, 0) / total) * 10) / 10
      : null;

  return NextResponse.json({ resenas, promedio, total });
}

/* Límite por IP: máximo 3 envíos por hora. Vive en memoria del proceso, así
   que se pierde en cada deploy y no se comparte entre instancias de Vercel:
   no es una defensa fuerte contra un ataque, solo frena el envío repetido
   desde el formulario. La moderación real es el tilde de Publicada. */
const LIMITE_POR_HORA = 3;
const VENTANA_MS = 60 * 60 * 1000;
const enviosPorIp = new Map<string, number[]>();

/* Techo global de escrituras, sin mirar de quién vienen. El límite por IP se
   evade rotando el x-forwarded-for, que es un header del cliente; este
   contador no depende de nada que el cliente controle. Importa porque la
   tabla Reseñas comparte base con Productos: un flood consume el cupo de
   registros de la base y ahí sí se rompe el catálogo. */
const TECHO_GLOBAL_POR_HORA = 20;
let escriturasEnLaHora = { desde: Date.now(), n: 0 };

function techoGlobalSuperado(): boolean {
  const ahora = Date.now();
  if (ahora - escriturasEnLaHora.desde >= VENTANA_MS) {
    escriturasEnLaHora = { desde: ahora, n: 0 };
  }
  if (escriturasEnLaHora.n >= TECHO_GLOBAL_POR_HORA) return true;

  escriturasEnLaHora.n += 1;
  return false;
}

function limiteSuperado(ip: string): boolean {
  const ahora = Date.now();
  const previos = (enviosPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);

  if (previos.length >= LIMITE_POR_HORA) {
    enviosPorIp.set(ip, previos);
    return true;
  }

  previos.push(ahora);
  enviosPorIp.set(ip, previos);

  /* Barrido de IPs vencidas para que el Map no crezca sin techo en un proceso
     de larga vida. */
  if (enviosPorIp.size > 500) {
    for (const [clave, marcas] of enviosPorIp) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) enviosPorIp.delete(clave);
    }
  }

  return false;
}

function ipDe(request: Request): string {
  /* x-vercel-forwarded-for y x-real-ip los escribe la plataforma y el cliente
     no los puede pisar; se prueban primero. En x-forwarded-for se toma el
     ÚLTIMO valor y no el primero: el último lo agrega el proxy de confianza,
     el primero es el que el atacante inyecta para elegir su propia identidad
     de rate limit. */
  const dePlataforma =
    request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-real-ip");
  if (dePlataforma) return dePlataforma.trim();

  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) {
    const partes = reenviada.split(",");
    return partes[partes.length - 1].trim();
  }
  return "desconocida";
}

/* Un formulario de opinión no tiene motivo legítimo para traer un link ni
   etiquetas: el spam que ya llegó usaba las dos cosas. */
/* La rama de dominio suelto pide que el TLD termine el token (espacio, signo o
   fin de texto) y ya no incluye ar, co, me, top ni live: son palabras
   castellanas y disparaban con un typo de espacio ("envio rapido.me
   atendieron"). El spam real sigue cayendo por https://, www. o mail. */
const TIENE_ENLACE =
  /(https?:\/\/|www\.|\S+@\S+\.\S+|\b[a-z0-9-]{2,}\.(com|net|org|io|xyz|ru|info|biz|link|shop|online|site|club|store|app|dev)(?=[\s,.;!?]|$))/i;
const TIENE_HTML = /<[^>]*>|&#\d+;/;

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim().replace(/\s+/g, " ") : "";
}

interface Validacion {
  ok: boolean;
  error?: string;
  datos?: { nombre: string; equipo: string; estrellas: number; comentario: string };
}

function validar(body: unknown): Validacion {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "No pudimos leer los datos del formulario." };
  }
  const crudo = body as Record<string, unknown>;

  const nombre = texto(crudo.nombre);
  const equipo = texto(crudo.equipo);
  /* En el comentario se colapsan espacios repetidos pero se respetan los
     saltos de línea, que son parte de cómo la gente escribe. */
  const comentario =
    typeof crudo.comentario === "string"
      ? crudo.comentario.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
      : "";

  if (nombre.length < 2) return { ok: false, error: "Indicá tu nombre (mínimo 2 caracteres)." };
  if (nombre.length > 40) return { ok: false, error: "El nombre no puede superar los 40 caracteres." };
  if (equipo.length > 60) return { ok: false, error: "El equipo no puede superar los 60 caracteres." };
  if (comentario.length > 500)
    return { ok: false, error: "El comentario no puede superar los 500 caracteres." };

  const estrellasCrudas = crudo.estrellas;
  /* Solo número o string numérico: Number(true) da 1 y Number([5]) da 5, los
     dos caerían dentro de 1-5 y ensuciarían el promedio con un puntaje que
     nadie eligió. */
  const estrellas =
    typeof estrellasCrudas === "number"
      ? estrellasCrudas
      : typeof estrellasCrudas === "string"
        ? Number(estrellasCrudas.trim())
        : NaN;
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
    return { ok: false, error: "Elegí una puntuación de 1 a 5 estrellas." };
  }

  /* equipo también se filtra: es texto libre que la tarjeta muestra con el
     prefijo "Compró:", o sea 60 caracteres donde meter una URL. */
  if (TIENE_ENLACE.test(nombre) || TIENE_ENLACE.test(equipo) || TIENE_ENLACE.test(comentario)) {
    return { ok: false, error: "No podemos publicar reseñas con enlaces o direcciones de correo." };
  }
  if (TIENE_HTML.test(nombre) || TIENE_HTML.test(equipo) || TIENE_HTML.test(comentario)) {
    return { ok: false, error: "El texto no puede incluir etiquetas HTML." };
  }

  return { ok: true, datos: { nombre, equipo, estrellas, comentario } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "No pudimos leer los datos del formulario." },
      { status: 400 }
    );
  }

  const validacion = validar(body);
  if (!validacion.ok || !validacion.datos) {
    return NextResponse.json({ ok: false, error: validacion.error }, { status: 400 });
  }

  /* El límite se cuenta recién con los datos válidos: un error de tipeo no
     debería gastarle los tres intentos a alguien de buena fe. */
  if (limiteSuperado(ipDe(request))) {
    return NextResponse.json(
      { ok: false, error: "Ya enviaste varias reseñas. Probá de nuevo en un rato." },
      { status: 429 }
    );
  }

  /* Se evalúa después del límite por IP para que un envío ya rechazado no
     consuma cupo global. */
  if (techoGlobalSuperado()) {
    return NextResponse.json(
      { ok: false, error: "Estamos recibiendo muchas reseñas en este momento. Probá más tarde." },
      { status: 429 }
    );
  }

  try {
    await crearResena(validacion.datos);
  } catch (err) {
    console.error("POST /api/resenas: no se pudo crear la reseña", err);
    return NextResponse.json(
      { ok: false, error: "No pudimos guardar tu reseña. Intentá de nuevo en unos minutos." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
