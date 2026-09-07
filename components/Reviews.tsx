"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiStar,
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import SectionDivider from "./SectionDivider";
import type { Resena } from "@/lib/resenas";

const INITIAL = 6;

const WHATSAPP =
  "https://wa.me/3757541930?text=" +
  encodeURIComponent("Hola! Quiero consultar por un equipo.");

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/* La fecha llega como YYYY-MM-DD y se parte a mano en vez de usar new Date():
   ese string se interpreta como UTC y en Argentina (UTC-3) el día 1 de cada mes
   se mostraba con el mes anterior. */
function mesYAnio(iso: string): string {
  const partes = /^(\d{4})-(\d{2})/.exec(iso);
  if (!partes) return "";
  return `${MESES[Number(partes[2]) - 1] ?? ""} ${partes[1]}`;
}

/* Acepta decimales porque el promedio puede ser 4.5: redondeando al entero más
   cercano un 4.5 dibujaba las cinco doradas y regalaba medio punto de
   calificación. La media estrella es un HiStar dorado recortado al 50% por un
   contenedor con overflow-hidden, sin librería extra. */
function Stars({ count }: { count: number }) {
  const etiqueta = Number.isInteger(count) ? String(count) : count.toFixed(1);
  return (
    <div role="img" aria-label={`${etiqueta} de 5 estrellas`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const parte = Math.min(Math.max(count - i, 0), 1);
        /* Solo la franja del medio se dibuja a mitad: por debajo de .3 la
           estrella va vacía y por encima de .7 va llena, así el dibujo nunca
           sugiere más puntaje del que hay. */
        const relleno = parte >= 0.7 ? 100 : parte >= 0.3 ? 50 : 0;
        return (
          <span key={i} aria-hidden="true" className="relative inline-flex size-3.5">
            <HiStar className="size-3.5 text-white/10" />
            {relleno > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${relleno}%` }}
              >
                <HiStar className="size-3.5 text-yellow-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ReviewFormModal({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [equipo, setEquipo] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input, textarea")?.focus();

    /* Foco atrapado dentro del panel: con el modal abierto el Tab no puede
       llevar al usuario de teclado a los links de la página de atrás. */
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      const activo = document.activeElement;
      if (e.shiftKey && (activo === primero || !panel.contains(activo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPresionar);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", alPresionar);
    };
  }, [onClose]);

  /* Los mínimos y máximos son los mismos que valida la ruta: así el error de
     largo se ve antes de gastar un envío del límite por hora. */
  const puedeEnviar =
    nombre.trim().length >= 2 &&
    equipo.trim().length > 0 &&
    comentario.trim().length > 0 &&
    estrellas > 0;

  const enviar = async () => {
    /* El guard por `enviando` evita el doble alta si alguien hace dos clicks
       seguidos antes de que el botón se repinte deshabilitado. */
    if (!puedeEnviar || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          equipo: equipo.trim(),
          estrellas,
          comentario: comentario.trim(),
        }),
      });

      const datos: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));

      /* El 429 es el límite de envíos por hora del servidor: se avisa aparte
         porque no es un dato mal cargado, es cuestión de esperar. */
      if (res.status === 429) {
        setError(
          datos.error ?? "Ya enviaste varias reseñas. Probá de nuevo en un rato."
        );
        return;
      }

      if (!res.ok || !datos.ok) {
        setError(datos.error ?? "No pudimos guardar tu reseña. Probá de nuevo en un momento.");
        return;
      }

      setEnviado(true);
    } catch {
      setError("No pudimos conectarnos con el servidor. Revisá tu conexión y probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-resena"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 sm:p-8 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-slate-500 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <HiOutlineXMark aria-hidden="true" className="size-6" />
        </button>

        {enviado ? (
          <div className="text-center space-y-4 py-2">
            <span
              aria-hidden="true"
              className="mx-auto size-12 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/25 flex items-center justify-center"
            >
              <HiOutlineCheckCircle className="size-6" style={{ color: "#d4a843" }} />
            </span>
            <h3 id="titulo-resena" className="text-xl font-medium text-white">
              Recibimos tu reseña
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Queda para revisión. La publicamos en el sitio en cuanto la aprobemos, para que acá
              solo aparezcan comentarios de clientes reales.
            </p>
            <button
              onClick={onClose}
              className="btn-outline-gold cursor-pointer w-full py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div>
              <h3 id="titulo-resena" className="text-xl font-medium text-white">
                Dejá tu reseña
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Contanos tu experiencia con IPHONES LUXURY. La revisamos antes de publicarla.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Puntuación</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEstrellas(star)}
                    aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={star === estrellas}
                    className="cursor-pointer p-0.5"
                  >
                    <HiStar
                      aria-hidden="true"
                      className={`size-7 transition-colors ${
                        star <= estrellas ? "text-yellow-400" : "text-white/10 hover:text-white/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              aria-label="Tu nombre"
              maxLength={40}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            />

            <input
              type="text"
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              placeholder="Equipo comprado (ej: iPhone 14 Pro 128GB)"
              aria-label="Equipo comprado"
              maxLength={60}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            />

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Contanos cómo fue tu compra"
              aria-label="Comentario"
              maxLength={500}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
            />

            {error && (
              <p role="alert" className="text-sm text-red-400 leading-relaxed">
                {error}
              </p>
            )}

            <button
              onClick={enviar}
              disabled={!puedeEnviar || enviando}
              className={`cursor-pointer w-full py-3.5 min-h-[44px] rounded-full text-sm font-semibold transition-all ${
                puedeEnviar && !enviando
                  ? "btn-gold active:scale-95"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
            >
              {enviando ? "Enviando…" : "Enviar reseña"}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function Reviews() {
  const [visible, setVisible] = useState(INITIAL);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let vigente = true;
    fetch("/api/resenas")
      .then((res) => res.json())
      .then((data: { resenas?: Resena[]; promedio?: number | null; total?: number }) => {
        if (!vigente) return;
        setResenas(Array.isArray(data.resenas) ? data.resenas : []);
        setPromedio(typeof data.promedio === "number" ? data.promedio : null);
        setTotal(typeof data.total === "number" ? data.total : 0);
      })
      /* Si la lectura falla la sección se queda en el estado vacío, que ya es
         una pantalla presentable, en vez de mostrar un error. */
      .catch(() => {})
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash === "#dejar-resena") setShowForm(true);
  }, []);

  const abrirForm = () => {
    window.history.replaceState(null, "", "#dejar-resena");
    setShowForm(true);
  };

  /* Estable a propósito: el modal lo usa como dependencia del efecto que
     engancha el teclado, y con una función nueva por render se volvía a montar
     el listener (y a robar el foco) en cada tecla. */
  const cerrarForm = useCallback(() => {
    setShowForm(false);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const hayResenas = resenas.length > 0;

  return (
    <section id="resenas" className="relative py-20 px-6 scroll-mt-24 bg-[#101010]">
      <SectionDivider edge="top" shape="asymmetric" />
      <SectionDivider edge="bottom" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="section-badge mb-4">
            <HiStar aria-hidden="true" className="size-3.5" />
            Reseñas
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Más de 500 equipos vendidos
          </h2>
          <p className="text-slate-500 text-pretty">
            Cada reseña que ves acá la dejó un cliente y la revisamos antes de publicarla.
          </p>
        </div>

        {cargando ? (
          /* Marca el lugar de la tarjeta de calificación mientras llega la
             respuesta, para que la sección no salte al terminar de cargar. */
          <div
            aria-hidden="true"
            className="glass-panel rounded-2xl p-5 sm:p-6 max-w-lg mx-auto h-[124px] sm:h-[104px] animate-pulse"
          />
        ) : hayResenas ? (
          <>
            {/* Tarjeta de calificación. En teléfono el botón baja a lo ancho en
                vez de pelear por el espacio con el texto: con las tres cosas en
                una fila, a 390px el nombre del negocio y la línea de conteo
                quedaban en una columna de menos de 150px, partidos en cuatro
                renglones. */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6 max-w-lg mx-auto mb-12 flex flex-wrap items-center gap-4 sm:gap-5">
              <span
                aria-hidden="true"
                className="size-9 sm:size-10 shrink-0 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/25 flex items-center justify-center"
              >
                <HiStar className="size-5" style={{ color: "#d4a843" }} />
              </span>
              <div className="flex-1 min-w-0">
                {/* Sin truncate: el nombre del negocio es la prueba social de la
                    tarjeta y con el ancho de un teléfono de 360 o 375 se cortaba
                    en "IPHONES LUXU…". Prefiero que baje a dos renglones antes
                    que mostrar la marca a medias. */}
                <p className="text-white font-semibold text-sm sm:text-base">IPHONES LUXURY</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-white tabular-nums">
                    {(promedio ?? 0).toFixed(1)}
                  </span>
                  <Stars count={promedio ?? 0} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {total === 1 ? "1 reseña publicada" : `${total} reseñas publicadas`}
                </p>
              </div>
              <button
                onClick={abrirForm}
                className="btn-gold cursor-pointer w-full sm:w-auto sm:shrink-0 px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-semibold"
              >
                Escribir reseña
              </button>
            </div>

            {/* Grid. Con menos de tres reseñas se acota y se centra el
                contenedor: en tres columnas fijas una sola tarjeta quedaba
                pegada al borde izquierdo con dos tercios de fila vacíos,
                desalineada del panel de calificación que sí está centrado. */}
            <div
              className={`grid gap-4 grid-cols-1 ${
                resenas.length === 1
                  ? "max-w-lg mx-auto"
                  : resenas.length === 2
                    ? "md:grid-cols-2 max-w-3xl mx-auto"
                    : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {resenas.slice(0, visible).map((resena) => (
                <div
                  key={resena.id}
                  className="glass-panel rounded-xl p-5 space-y-3 hover:border-white/15 transition-[border-color]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                        {resena.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{resena.nombre}</p>
                        <p className="text-xs text-slate-500">{mesYAnio(resena.fecha)}</p>
                      </div>
                    </div>
                    <Stars count={resena.estrellas} />
                  </div>
                  {resena.equipo && (
                    <p className="text-xs text-amber-400/80 font-medium">Compró: {resena.equipo}</p>
                  )}
                  {resena.comentario && (
                    <p className="text-sm text-slate-400 leading-relaxed">
                      &ldquo;{resena.comentario}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            {visible < resenas.length ? (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisible(resenas.length)}
                  className="btn-outline-gold cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
                >
                  Ver todas las reseñas
                </button>
              </div>
            ) : (
              resenas.length > INITIAL && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisible(INITIAL)}
                    className="btn-outline-gold cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
                  >
                    Ver menos
                  </button>
                </div>
              )
            )}
          </>
        ) : (
          /* Día uno: la tabla de reseñas está vacía. En vez de una tarjeta de
             calificación con un promedio inventado, la sección invita a dejar
             la primera y explica por qué todavía no hay ninguna. */
          <div className="glass-panel rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto text-center">
            <span
              aria-hidden="true"
              className="mx-auto size-12 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/25 flex items-center justify-center"
            >
              <HiOutlinePencilSquare className="size-6" style={{ color: "#d4a843" }} />
            </span>
            <h3 className="text-lg sm:text-xl font-medium text-white mt-5 text-balance">
              Todavía no hay reseñas publicadas
            </h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed text-pretty max-w-md mx-auto">
              Empezamos de cero: acá vamos a publicar únicamente reseñas de clientes, revisadas una
              por una. Si ya compraste con nosotros, la tuya puede ser la primera.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:justify-center">
              <button
                onClick={abrirForm}
                className="btn-gold cursor-pointer flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 min-h-[44px] rounded-full text-[13px] sm:text-sm font-semibold uppercase tracking-wide active:scale-95 transition-[transform,filter]"
              >
                <HiOutlinePencilSquare aria-hidden="true" className="size-4" />
                Escribir la primera
              </button>
              {/* Los dos botones van un punto más chicos que el resto de los del
                  sitio: a 390px "Consultar por WhatsApp" en 14px se partía en dos
                  renglones y el ícono quedaba flotando al costado. */}
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 min-h-[44px] rounded-full text-[13px] sm:text-sm font-semibold uppercase active:scale-95"
              >
                <FaWhatsapp aria-hidden="true" className="size-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}

        {showForm && <ReviewFormModal onClose={cerrarForm} />}
      </div>
    </section>
  );
}
