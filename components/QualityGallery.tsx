"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { HiOutlineShieldCheck, HiOutlineBattery100, HiOutlineCheckBadge } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

const galleryImages = [
  // Row 1
  { src: "/iphones/17-pro/silver.jpg", alt: "iPhone 17 Pro Silver" },
  { src: "/iphones/17-pro/naranja.jpg", alt: "iPhone 17 Pro Desierto" },
  { src: "/iphones/15-pro-max/titanio2.jpg", alt: "iPhone 15 Pro Max Titanio" },
  { src: "/iphones/16/rosa.jpg", alt: "iPhone 16 Rosa" },
  { src: "/iphones/14-pro-max/violeta.jpg", alt: "iPhone 14 Pro Max Violeta" },
  { src: "/iphones/14-pro-max/dorado.jpg", alt: "iPhone 14 Pro Max Dorado" },
  { src: "/iphones/15/rosa.jpeg", alt: "iPhone 15 Rosa" },
  { src: "/iphones/15-pro-max/blanco.jpg", alt: "iPhone 15 Pro Max Blanco" },
  { src: "/iphones/13-pro/verde2.jpg", alt: "iPhone 13 Pro Verde Alpino" },
  { src: "/iphones/15-pro-max/negro2.jpg", alt: "iPhone 15 Pro Max Negro" },
  { src: "/iphones/14/azul.jpg", alt: "iPhone 14 Azul" },
  { src: "/iphones/15-pro-max/azul3.jpg", alt: "iPhone 15 Pro Max Azul" },
  { src: "/iphones/16/iphone16-negro.jpg", alt: "iPhone 16 Negro" },
  { src: "/iphones/13-pro-max/grafito2.jpg", alt: "iPhone 13 Pro Max Grafito" },
  { src: "/iphones/15-pro/titanio.jpg", alt: "iPhone 15 Pro Titanio Natural" },
  { src: "/iphones/12/blanco2.jpg", alt: "iPhone 12 Blanco" },
  { src: "/iphones/15/azul.jpeg", alt: "iPhone 15 Azul" },
  // Row 2
  { src: "/iphones/13/negro.jpg", alt: "iPhone 13 Medianoche" },
  { src: "/iphones/11/violeta.jpg", alt: "iPhone 11 Violeta" },
  { src: "/iphones/13/iphone13-rosa.jpg", alt: "iPhone 13 Rosa" },
  { src: "/iphones/15-pro/negro.jpg", alt: "iPhone 15 Pro Negro" },
  { src: "/iphones/16-pro/desert.jpg", alt: "iPhone 16 Pro Desert" },
  { src: "/iphones/15/amarillo.jpg", alt: "iPhone 15 Amarillo" },
  { src: "/iphones/16/iphone16-azulultramar.jpg", alt: "iPhone 16 Azul Ultramar" },
  { src: "/iphones/15-pro/azul.jpg", alt: "iPhone 15 Pro Titanio Azul" },
  { src: "/iphones/13/verde.jpg", alt: "iPhone 13 Verde" },
  { src: "/iphones/15-pro/blanco.jpg", alt: "iPhone 15 Pro Blanco" },
  { src: "/iphones/11/verde.jpg", alt: "iPhone 11 Verde" },
  { src: "/iphones/14/violeta.jpg", alt: "iPhone 14 Violeta" },
  { src: "/iphones/17-pro/ultramar.jpg", alt: "iPhone 17 Pro Titanio Ultramar" },
  { src: "/iphones/14-pro/blanco.jpg", alt: "iPhone 14 Pro Blanco" },
  { src: "/iphones/15/negro.jpg", alt: "iPhone 15 Negro" },
  { src: "/iphones/16-pro/negro.jpeg", alt: "iPhone 16 Pro Negro" },
  { src: "/iphones/13/azul.jpg", alt: "iPhone 13 Azul" },
  { src: "/iphones/13-pro-max/verde.jpeg", alt: "iPhone 13 Pro Max Verde" },
  { src: "/iphones/14/medianoche.jpg", alt: "iPhone 14 Medianoche" },
  { src: "/iphones/14-pro/negro.jpeg", alt: "iPhone 14 Pro Negro" },
];

const row1 = galleryImages.slice(0, 18);
const row2 = galleryImages.slice(18);

const qualityPoints = [
  {
    icon: HiOutlineBattery100,
    title: "Batería al 100%",
    desc: "Todos los equipos con batería nueva o al máximo de salud.",
  },
  {
    icon: HiOutlineCheckBadge,
    title: "Verificación completa",
    desc: "Cada función testeada: cámaras, sensores, Face ID, parlantes.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Garantía 30 días",
    desc: "Cobertura total ante cualquier falla de funcionamiento.",
  },
];

function MarqueeRow({
  images,
  reverse = false,
}: {
  images: typeof galleryImages;
  reverse?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;
    let pos = 0;
    const speed = reverse ? -0.4 : 0.4;
    const totalWidth = el.scrollWidth / 2;

    function step() {
      pos += speed;
      if (!reverse && pos >= totalWidth) pos = 0;
      if (reverse && Math.abs(pos) >= totalWidth) pos = 0;
      el!.style.transform = `translateX(${-Math.abs(pos)}px)`;
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  const doubled = [...images, ...images];

  return (
    <div className="overflow-hidden">
      <div ref={scrollRef} className="flex gap-3 will-change-transform">
        {doubled.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            className="relative w-[200px] sm:w-[260px] md:w-[300px] aspect-[4/3] rounded-xl overflow-hidden shrink-0 group"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-3 left-3 text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {img.alt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QualityGallery() {
  return (
    <section id="quality" className="py-16 md:py-20 overflow-hidden">
      {/* Hero: Video + Quality Points */}
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-sm font-medium text-amber-400 mb-5">
          <span className="flex size-2 rounded-full bg-amber-400" />
          Calidad A+
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3 text-balance">
          Cada iPhone, verificado al 100%
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg text-pretty mb-8 md:mb-12">
          Revisamos cada detalle antes de publicar. Sin sorpresas, lo que ves es lo que recibís.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Video */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[9/16] sm:aspect-video max-h-[70vh] sm:max-h-none">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover saturate-[1.15] contrast-[1.1] brightness-[0.95] hue-rotate-[-12deg]"
            >
              <source src="/quality-showcase.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
              <p className="text-white text-sm sm:text-base font-medium">
                Proceso de verificación en nuestro local
              </p>
            </div>
          </div>

          {/* Quality Points + CTA */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {qualityPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="glass-panel rounded-xl p-5 sm:p-6 flex gap-4 items-start"
                >
                  <div className="shrink-0 size-10 sm:size-11 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Icon className="size-5 sm:size-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">{point.title}</p>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              );
            })}
            <a
              href="https://wa.me/3757541930?text=Hola!%20Quiero%20ver%20fotos%20de%20un%20modelo"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer glass-panel rounded-xl p-5 sm:p-6 flex items-center justify-center gap-3 text-amber-400 hover:bg-amber-500/5 hover:border-amber-500/20 transition-[background-color,border-color] duration-150 mt-auto"
            >
              <FaWhatsapp className="size-5" />
              <span className="font-medium text-sm sm:text-base">Pedí fotos de tu modelo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Photo Marquee */}
      <div className="space-y-3">
        <MarqueeRow images={row1} />
        <MarqueeRow images={row2} reverse />
      </div>
    </section>
  );
}
