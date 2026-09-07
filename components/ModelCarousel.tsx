"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiOutlineSpeakerWave, HiOutlineSpeakerXMark, HiOutlineSquares2X2 } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { iphoneSpecsMap, formatPrice, getWhatsAppLink, getSeriesNumber, type Product } from "@/data/products";
import { useCurrency } from "./CurrencyProvider";

interface ModelCard {
  key: string;
  name: string;
  kicker: string;
  image?: string;
  /** Color de la unidad cuya foto se muestra: sin esto el alt describiría un color que no es el de la foto. */
  imageColor?: string;
  minPrice: number;
  maxPrice: number;
  cheapest: Product;
  variants: number;
  features: string[];
  year: number;
}

function buildModels(products: Product[]): ModelCard[] {
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    if (p.category && p.category !== "iphone") continue;
    if (p.price <= 0) continue;
    const list = groups.get(p.modelKey) ?? [];
    list.push(p);
    groups.set(p.modelKey, list);
  }

  const cards: ModelCard[] = [];
  for (const [key, list] of groups) {
    const specs = iphoneSpecsMap[key];
    const prices = list.map((p) => p.price);
    const cheapest = list.reduce((a, b) => (b.price < a.price ? b : a));
    const withImage = list.find((p) => p.images && p.images.length > 0);
    const series = getSeriesNumber(key);

    const features: string[] = [];
    if (specs) {
      features.push(specs.chip);
      features.push(`${specs.displaySize} ${specs.refreshRate.includes("120") ? "120Hz" : "OLED"}`);
      features.push(specs.mainCamera.split(" + ")[0] + " cámara");
      features.push(specs.connectivity.includes("USB-C") ? "USB-C" : "Lightning");
    }

    cards.push({
      key,
      name: key,
      kicker: series ? `Serie ${series}` : "iPhone",
      image: withImage?.images?.[0],
      imageColor: withImage?.color,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      cheapest,
      variants: list.length,
      features,
      year: specs?.releaseYear ?? 0,
    });
  }

  return cards.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
}

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

/** Short synthesized "click + thunk" — a premium roulette-style tick, no audio assets. */
function useTick(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (muted || typeof window === "undefined") return;
    try {
      const Ctx =
        typeof AudioContext !== "undefined"
          ? AudioContext
          : (window as WindowWithWebkit).webkitAudioContext;
      if (!Ctx) return;
      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = new Ctx();
        ctxRef.current = ctx;
      }
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(1800, t);
      click.frequency.exponentialRampToValueAtTime(900, t + 0.06);
      clickGain.gain.setValueAtTime(0.0001, t);
      clickGain.gain.exponentialRampToValueAtTime(0.16, t + 0.004);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      click.connect(clickGain).connect(ctx.destination);
      click.start(t);
      click.stop(t + 0.08);

      const thunk = ctx.createOscillator();
      const thunkGain = ctx.createGain();
      thunk.type = "sine";
      thunk.frequency.setValueAtTime(220, t);
      thunk.frequency.exponentialRampToValueAtTime(110, t + 0.12);
      thunkGain.gain.setValueAtTime(0.0001, t);
      thunkGain.gain.exponentialRampToValueAtTime(0.1, t + 0.006);
      thunkGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      thunk.connect(thunkGain).connect(ctx.destination);
      thunk.start(t);
      thunk.stop(t + 0.15);
    } catch {
      // Audio is a nicety; never let it break navigation.
    }
  }, [muted]);
}

const MUTE_KEY = "iphones_luxury_carousel_muted";
const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;
/** Distance between card centers, as a % of the card's own width. */
const STEP = 104;

const fmtArs = (n: number) => `$${new Intl.NumberFormat("de-DE").format(n)}`;

export default function ModelCarousel({ products }: { products: Product[] }) {
  const models = useMemo(() => buildModels(products), [products]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(false);
  const reduceMotion = useReducedMotion();
  const { blueRate } = useCurrency();
  const tick = useTick(muted);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    } catch {}
  }, []);

  const toggleMute = () => {
    setMuted((m) => {
      try {
        localStorage.setItem(MUTE_KEY, m ? "0" : "1");
      } catch {}
      return !m;
    });
  };

  const go = useCallback(
    (dir: 1 | -1) => {
      if (models.length < 2) return;
      setActive((i) => (i + dir + models.length) % models.length);
      tick();
    },
    [models.length, tick]
  );

  const goTo = (i: number) => {
    if (i === active) return;
    setActive(i);
    tick();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) go(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  if (models.length === 0) return null;

  // A long ease-out slide reads as "the cards move over", not "the card switches".
  const transition = reduceMotion
    ? { duration: 0.25 }
    : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="section-badge mb-4">
          <HiOutlineSquares2X2 aria-hidden="true" className="size-3.5" />
          Modelos
        </span>
        <h3 className="text-xl md:text-2xl font-medium text-white mb-2 text-balance">Explorá cada modelo</h3>
        <p className="text-sm text-slate-500">
          Arrastrá o usá las flechas para ver qué lo diferencia y en qué rango de precio se mueve.
        </p>
      </div>

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Modelos de iPhone"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60 rounded-3xl"
      >
        {/* Track: the drag physically pulls the cards; on release the index changes and they glide into place */}
        <div className="[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.15)_6%,rgba(0,0,0,0.5)_12%,black_18%,black_82%,rgba(0,0,0,0.5)_88%,rgba(0,0,0,0.15)_94%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.12)_10%,rgba(0,0,0,0.4)_20%,black_32%,black_68%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.12)_90%,transparent)]">
        <motion.div
          drag={models.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
          onDragEnd={onDragEnd}
          className="relative h-[640px] sm:h-[620px] cursor-grab active:cursor-grabbing select-none"
        >
          {models.map((m, i) => {
            let offset = i - active;
            if (offset > models.length / 2) offset -= models.length;
            if (offset < -models.length / 2) offset += models.length;
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const arsMin = blueRate ? Math.round(m.minPrice * blueRate) : null;
            const arsMax = blueRate ? Math.round(m.maxPrice * blueRate) : null;
            const sameRange = m.minPrice === m.maxPrice;

            return (
              <motion.article
                key={m.key}
                aria-hidden={!isActive}
                initial={false}
                animate={{
                  x: `${offset * STEP}%`,
                  scale: isActive ? 1 : 0.9,
                  opacity: distance === 0 ? 1 : distance === 1 ? 0.5 : 0,
                  filter: isActive ? "blur(0px)" : "blur(1px)",
                }}
                transition={transition}
                style={{ zIndex: isActive ? 20 : 10 - distance }}
                className={`absolute inset-y-0 left-1/2 -ml-[46%] sm:-ml-[35%] lg:-ml-[20%] w-[92%] sm:w-[70%] lg:w-[40%] ${
                  isActive ? "" : "pointer-events-none"
                }`}
              >
                <div className="glass-panel rounded-3xl h-full p-3 sm:p-4 flex flex-col overflow-hidden">
                  <div className="flex justify-center mb-3">
                    <span className="section-badge">{m.kicker}</span>
                  </div>

                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden bg-black/40 h-44 sm:h-56 shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.imageColor ? `${m.name} ${m.imageColor}` : m.name}
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 40vw"
                        className="object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                        Sin foto todavía
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Details: only the centre card shows them, like the reference */}
                  <div
                    className={`flex-1 flex flex-col gap-3 pt-4 text-center transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div>
                      {/* h4: el título del bloque ("Explorá cada modelo") ya es el h3 de esta subsección */}
                      <h4 className="text-2xl sm:text-3xl font-medium text-white leading-tight">{m.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {m.variants} {m.variants === 1 ? "variante disponible" : "variantes disponibles"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Rango de precio</p>
                      {arsMin && arsMax ? (
                        <>
                          <p className="text-xl sm:text-2xl font-semibold text-gold tabular-nums">
                            {sameRange ? fmtArs(arsMin) : `${fmtArs(arsMin)} a ${fmtArs(arsMax)}`}
                          </p>
                          <p className="text-sm text-slate-500 tabular-nums">
                            {sameRange ? formatPrice(m.minPrice) : `${formatPrice(m.minPrice)} a ${formatPrice(m.maxPrice)}`}
                          </p>
                        </>
                      ) : (
                        <p className="text-xl sm:text-2xl font-semibold text-gold tabular-nums">
                          {sameRange ? formatPrice(m.minPrice) : `${formatPrice(m.minPrice)} a ${formatPrice(m.maxPrice)}`}
                        </p>
                      )}
                    </div>

                    {m.features.length > 0 && (
                      <ul className="flex flex-wrap justify-center gap-2">
                        {m.features.map((f) => (
                          <li
                            key={f}
                            className="text-xs text-slate-300 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <Link
                        href={`/producto/${m.cheapest.id}`}
                        aria-label={`Ver ${m.name}`}
                        className="btn-gold flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide active:scale-95 transition-[transform,filter]"
                      >
                        Ver modelo
                      </Link>
                      <a
                        href={getWhatsAppLink(m.cheapest)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar por WhatsApp por el ${m.name}`}
                        className="btn-outline-gold flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
                      >
                        <FaWhatsapp aria-hidden="true" className="size-4" />
                        Consultar
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
        </div>

        {/* Prev / Next */}
        {models.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Modelo anterior"
              className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full glass-panel flex items-center justify-center text-white hover:border-[#d4a843]/50 hover:text-[#d4a843] transition-colors"
            >
              <HiChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Modelo siguiente"
              className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full glass-panel flex items-center justify-center text-white hover:border-[#d4a843]/50 hover:text-[#d4a843] transition-colors"
            >
              <HiChevronRight aria-hidden="true" className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Contador + dots + mute. Van en flujo debajo del carrusel: flotando dentro de la pista
          caían justo encima de los CTA de la tarjeta activa y tapaban "Ver modelo" y "Consultar". */}
      <div className="mt-6 flex items-center justify-center gap-x-4 gap-y-3 flex-wrap">
        {models.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {models.map((m, i) => (
              <button
                key={m.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a ${m.name}`}
                aria-current={i === active ? "true" : undefined}
                className={`cursor-pointer h-2 rounded-full transition-all duration-200 ${
                  i === active ? "w-8 bg-[#d4a843]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador y mute juntos para que al envolver en mobile bajen como un solo bloque */}
        <div className="flex items-center gap-2">
          <span aria-live="polite" className="glass-panel rounded-full px-4 py-1.5 text-xs text-white tabular-nums">
            {active + 1} / {models.length}
          </span>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
            aria-pressed={muted}
            className="cursor-pointer glass-panel rounded-full size-8 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            {muted ? (
              <HiOutlineSpeakerXMark aria-hidden="true" className="size-4" />
            ) : (
              <HiOutlineSpeakerWave aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
