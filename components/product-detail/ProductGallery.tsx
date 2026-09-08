"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { HiOutlineEye, HiOutlineCpuChip, HiOutlineSwatch } from "react-icons/hi2";
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

  /* Carrusel de fotos: en el celular el deslizar ya lo resuelve el scroll
     nativo con snap, así que sólo hay que agregar el arrastre con el mouse
     para la computadora. Nada de librerías. */
  const pista = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{ x: number; scroll: number } | null>(null);

  const irAFoto = (i: number) => {
    const el = pista.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActiveImage(i);
  };

  const alScrollear = () => {
    const el = pista.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImage((previo) => (previo === i ? previo : i));
  };

  /* Sólo el mouse: en pantalla táctil el navegador ya hace el gesto, y
     manotearlo desde acá se pelea con el scroll vertical de la página. */
  const alApretar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !pista.current) return;
    arrastre.current = { x: e.clientX, scroll: pista.current.scrollLeft };
    /* Con scroll-snap obligatorio el navegador devuelve el scroll al punto de
       anclaje en cuanto se toca scrollLeft a mano, así que el arrastre no se
       movía. Se apaga mientras dura y se vuelve a prender al soltar. */
    pista.current.style.scrollSnapType = "none";
    pista.current.setPointerCapture(e.pointerId);
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastre.current || !pista.current) return;
    e.preventDefault();
    pista.current.scrollLeft = arrastre.current.scroll - (e.clientX - arrastre.current.x);
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastre.current || !pista.current) return;
    arrastre.current = null;
    pista.current.style.scrollSnapType = "";
    if (pista.current.hasPointerCapture(e.pointerId)) {
      pista.current.releasePointerCapture(e.pointerId);
    }
    /* El snap del navegador no se dispara si el scroll terminó por soltar el
       mouse, así que se acomoda a mano a la foto más cercana. */
    irAFoto(Math.round(pista.current.scrollLeft / pista.current.clientWidth));
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
        className="relative aspect-square rounded-2xl overflow-hidden glass-panel flex items-center justify-center"
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

        {/* Capacity badge overlay */}
        <div className="absolute top-4 right-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm">
            {product.capacity}
          </span>
        </div>
      </div>

      {/* Recorrido: muestra en qué foto va y cuántas quedan, que arrastrando
          sin referencia no se sabe si hay más. */}
      {images.length > 1 && activeTab === "color" && (
        <div className="flex items-center gap-3">
          <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#d4a843] transition-transform duration-300 ease-out"
              style={{
                width: `${100 / images.length}%`,
                transform: `translateX(${activeImage * 100}%)`,
              }}
            />
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
            {activeImage + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Thumbnails: only when the product has more than one photo */}
      {images.length > 1 && activeTab === "color" && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => irAFoto(i)}
              aria-label={`Foto ${i + 1} de ${images.length}`}
              aria-pressed={i === activeImage}
              className={`cursor-pointer relative size-16 shrink-0 rounded-xl overflow-hidden glass-panel transition-[border-color] ${
                i === activeImage ? "border-[#d4a843]/70" : "hover:border-white/20"
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
