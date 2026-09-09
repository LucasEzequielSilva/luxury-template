"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  HiOutlineEye,
  HiOutlineCpuChip,
  HiOutlineSwatch,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { tituloEquipo, type Product, type IPhoneSpecs } from "@/data/products";

interface Props {
  product: Product;
  specs: IPhoneSpecs | null;
}

function PhoneSilhouette({ colorHex }: { colorHex: string }) {
  return (
    <div className="relative w-36 h-72 sm:w-48 sm:h-96 md:w-56 md:h-[420px] mx-auto">
      <div
        className="absolute inset-0 rounded-[3rem] border-2 border-white/10"
        style={{
          background: `linear-gradient(145deg, ${colorHex}22 0%, ${colorHex}08 50%, ${colorHex}15 100%)`,
          boxShadow: `0 0 80px ${colorHex}20, inset 0 0 40px ${colorHex}08`,
        }}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full bg-black/80 border border-white/5" />
        <div className="absolute inset-3 top-14 bottom-4 rounded-[2.2rem] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 30%, ${colorHex}40 0%, transparent 50%),
                radial-gradient(ellipse at 70% 70%, ${colorHex}25 0%, transparent 50%),
                linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)
              `,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        </div>
        <div
          className="absolute -right-0.5 top-32 w-1 h-12 rounded-full"
          style={{ backgroundColor: colorHex + "40" }}
        />
        <div
          className="absolute -left-0.5 top-28 w-1 h-8 rounded-full"
          style={{ backgroundColor: colorHex + "40" }}
        />
        <div
          className="absolute -left-0.5 top-40 w-1 h-8 rounded-full"
          style={{ backgroundColor: colorHex + "40" }}
        />
      </div>
      <div
        className="absolute -inset-8 rounded-full blur-lg opacity-20"
        style={{ backgroundColor: colorHex }}
      />
    </div>
  );
}

function ImageLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="relative size-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/60 animate-spin" />
      </div>
      <p className="text-xs text-slate-500 animate-pulse">Cargando imagen...</p>
    </div>
  );
}

/**
 * `fade` solo para las fotos que el usuario elige después del primer render: la
 * primera es el LCP de la ficha y con opacity-0 el píxel más grande de la página
 * no se pintaba hasta que corría JS.
 */
function ProductImage({
  src,
  alt,
  fade,
  prioridad,
}: {
  src: string;
  alt: string;
  fade: boolean;
  prioridad: boolean;
}) {
  const [loading, setLoading] = useState(fade);

  return (
    <>
      {loading && <ImageLoader />}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain p-4 ${
          fade ? `transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}` : ""
        }`}
        sizes="(max-width: 1024px) 100vw, 45vw"
        /* Sin esto el navegador arranca su arrastre nativo de imagen apenas
           apretás sobre la foto y se come el gesto del carrusel. */
        draggable={false}
        priority={prioridad}
        loading={prioridad ? undefined : "lazy"}
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

export default function ProductGallery({ product, specs }: Props) {
  const images = product.images ?? [];
  const hasImage = images.length > 0;
  const [activeTab, setActiveTab] = useState<string>("color");
  const [activeImage, setActiveImage] = useState(0);

  /* Carrusel de fotos. En el celular el gesto lo resuelve el scroll nativo con
     snap; en la computadora se agrega el arrastre con el mouse y las flechas.
     Sin librerías. */
  const pista = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{
    desdeX: number;
    desdeScroll: number;
    ultimoX: number;
    ultimoT: number;
    velocidad: number;
  } | null>(null);
  const animacion = useRef<number | null>(null);

  const frenarAnimacion = () => {
    if (animacion.current !== null) {
      cancelAnimationFrame(animacion.current);
      animacion.current = null;
    }
  };

  useEffect(() => frenarAnimacion, []);

  /* Easing propio en lugar de scroll-behavior:smooth. El nativo cambia de
     curva y de duración según el navegador, y en distancias cortas corta
     seco. Con una desaceleración siempre igual el movimiento acompaña en vez
     de saltar de una foto a la otra. */
  const animarHacia = (indice: number) => {
    const el = pista.current;
    if (!el || !el.clientWidth) return;
    const i = Math.max(0, Math.min(indice, images.length - 1));
    setActiveImage(i);
    frenarAnimacion();

    const desde = el.scrollLeft;
    const distancia = i * el.clientWidth - desde;
    if (Math.abs(distancia) < 1) return;

    /* El snap se apaga durante la animación: si queda prendido, el navegador
       tironea el scroll hacia el punto de anclaje en cada cuadro. */
    el.style.scrollSnapType = "none";
    const duracion = 520;
    const arranque = performance.now();

    const cuadro = (ahora: number) => {
      const t = Math.min(1, (ahora - arranque) / duracion);
      const suave = 1 - Math.pow(1 - t, 3);
      el.scrollLeft = desde + distancia * suave;
      if (t < 1) {
        animacion.current = requestAnimationFrame(cuadro);
      } else {
        animacion.current = null;
        el.style.scrollSnapType = "";
      }
    };
    animacion.current = requestAnimationFrame(cuadro);
  };

  const alScrollear = () => {
    const el = pista.current;
    if (!el || !el.clientWidth || animacion.current !== null) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImage((previo) => (previo === i ? previo : i));
  };

  /* Sólo el mouse: en pantalla táctil el navegador ya hace el gesto, y
     manotearlo desde acá se pelea con el scroll vertical de la página. */
  const alApretar = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = pista.current;
    if (e.pointerType !== "mouse" || !el || images.length < 2) return;
    frenarAnimacion();
    arrastre.current = {
      desdeX: e.clientX,
      desdeScroll: el.scrollLeft,
      ultimoX: e.clientX,
      ultimoT: performance.now(),
      velocidad: 0,
    };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = pista.current;
    const gesto = arrastre.current;
    if (!gesto || !el) return;
    e.preventDefault();
    el.scrollLeft = gesto.desdeScroll - (e.clientX - gesto.desdeX);

    const ahora = performance.now();
    const lapso = ahora - gesto.ultimoT;
    if (lapso > 0) gesto.velocidad = (e.clientX - gesto.ultimoX) / lapso;
    gesto.ultimoX = e.clientX;
    gesto.ultimoT = ahora;
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = pista.current;
    const gesto = arrastre.current;
    if (!gesto || !el) return;
    arrastre.current = null;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

    /* Un manotazo corto tiene que pasar de foto igual, aunque no haya
       recorrido media pantalla: es lo que hace que se sienta suelto y no
       trabado. Si el gesto fue lento, se acomoda a la foto más cercana. */
    const posicion = el.scrollLeft / el.clientWidth;
    const flick = Math.abs(gesto.velocidad) > 0.35;
    const destino = flick
      ? gesto.velocidad < 0
        ? Math.ceil(posicion)
        : Math.floor(posicion)
      : Math.round(posicion);
    animarHacia(destino);
  };

  const alTeclear = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      animarHacia(activeImage + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      animarHacia(activeImage - 1);
    }
  };

  const tabs = [
    { id: "color", label: "Color", icon: HiOutlineSwatch },
    ...(specs
      ? [
          { id: "specs", label: "Specs", icon: HiOutlineCpuChip },
          { id: "display", label: "Pantalla", icon: HiOutlineEye },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Main display */}
      <div
        className="group/galeria relative aspect-square rounded-2xl overflow-hidden glass-panel flex items-center justify-center"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${product.colorHex}20 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${product.colorHex}10 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)
          `,
        }}
      >
        {activeTab === "color" && (
          <>
            {hasImage ? (
              <div
                ref={pista}
                onScroll={alScrollear}
                onPointerDown={alApretar}
                onPointerMove={alMover}
                onPointerUp={alSoltar}
                onPointerCancel={alSoltar}
                onKeyDown={alTeclear}
                tabIndex={images.length > 1 ? 0 : -1}
                role="group"
                aria-roledescription="carrusel"
                aria-label={`Fotos de ${tituloEquipo(product)}`}
                className="absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain select-none [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((src, i) => (
                  <div
                    key={src}
                    className="relative size-full shrink-0 snap-center"
                    role="group"
                    aria-roledescription="foto"
                    aria-label={`${i + 1} de ${images.length}`}
                  >
                    <ProductImage
                      src={src}
                      alt={
                        i === 0
                          ? `${tituloEquipo(product)}, condición ${product.condition}`
                          : ""
                      }
                      fade={i !== 0}
                      prioridad={i === 0}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <PhoneSilhouette colorHex={product.colorHex} />
                <p className="text-sm text-slate-500">{product.color}</p>
              </div>
            )}
          </>
        )}

        {activeTab === "specs" && specs && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 p-4 sm:p-6 md:p-8 w-full">
            {[
              { label: "Chip", value: specs.chip },
              { label: "RAM", value: specs.ram },
              { label: "Cámara", value: specs.mainCamera },
              { label: "Batería", value: specs.battery },
              { label: "Peso", value: specs.weight },
              { label: "Resistencia", value: specs.waterResistance },
            ].map((item) => (
              <div key={item.label} className="glass-panel rounded-xl p-3 sm:p-4 min-w-0">
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase truncate">
                  {item.label}
                </p>
                <p className="text-xs sm:text-sm text-white mt-1 font-medium break-words leading-snug">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "display" && specs && (
          <div className="text-center space-y-3 p-6 sm:p-8">
            <p className="text-4xl sm:text-5xl font-light text-white">{specs.displaySize}</p>
            <p className="text-base sm:text-lg text-slate-400">{specs.displayType}</p>
            <p className="text-xs sm:text-sm text-slate-500">
              {specs.resolution} &middot; {specs.refreshRate}
            </p>
          </div>
        )}

        {/* Flechas: en la computadora aparecen al pasar el mouse para no tapar
            la foto, en el celular quedan visibles porque no hay hover. Se
            desvanecen en la primera y en la última en vez de quedar muertas. */}
        {hasImage && images.length > 1 && activeTab === "color" && (
          <>
            {[
              { lado: "izq", icono: HiChevronLeft, destino: activeImage - 1, oculta: activeImage === 0, texto: "Foto anterior" },
              { lado: "der", icono: HiChevronRight, destino: activeImage + 1, oculta: activeImage === images.length - 1, texto: "Foto siguiente" },
            ].map(({ lado, icono: Icono, destino, oculta, texto }) => (
              <button
                key={lado}
                type="button"
                onClick={() => animarHacia(destino)}
                aria-label={texto}
                className={`cursor-pointer absolute top-1/2 -translate-y-1/2 ${
                  lado === "izq" ? "left-3" : "right-3"
                } grid place-items-center size-11 rounded-full border border-white/15 bg-black/45 text-white/85 backdrop-blur-md shadow-lg shadow-black/30 transition-[opacity,transform,border-color,color] duration-300 ease-out hover:border-[#d4a843]/60 hover:text-[#d4a843] hover:scale-105 active:scale-95 ${
                  /* La flecha del extremo no lleva las clases de hover: si las
                     llevara, al pasar el mouse volvería a aparecer, porque las
                     dos reglas de opacidad tienen la misma especificidad y
                     gana la que Tailwind haya puesto última. */
                  oculta
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 md:opacity-0 md:group-hover/galeria:opacity-100"
                }`}
              >
                <Icono aria-hidden="true" className="size-5" />
              </button>
            ))}
          </>
        )}

        {/* Capacity badge overlay */}
        <div className="absolute top-4 right-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm">
            {product.capacity}
          </span>
        </div>
      </div>

      {/* Thumbnails: only when the product has more than one photo */}
      {images.length > 1 && activeTab === "color" && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => animarHacia(i)}
              aria-label={`Foto ${i + 1} de ${images.length}`}
              aria-pressed={i === activeImage}
              className={`cursor-pointer relative size-16 shrink-0 rounded-xl overflow-hidden glass-panel transition-[border-color,opacity,transform] duration-300 ease-out ${
                i === activeImage
                  ? "border-[#d4a843]/70 opacity-100"
                  : "opacity-55 hover:opacity-100 hover:border-white/20"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`cursor-pointer flex-1 glass-panel rounded-xl min-h-[44px] py-2.5 px-2 sm:p-3 flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-[border-color,background-color] ${
                activeTab === tab.id
                  ? "border-white/20 bg-white/5"
                  : "hover:bg-white/3"
              }`}
            >
              <Icon aria-hidden="true" className="size-5 text-slate-400" />
              <span className="text-xs text-slate-400">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 text-center">
        Recibís exactamente el equipo publicado
      </p>
    </div>
  );
}
