"use client";

import { HiOutlineShieldCheck, HiOutlineBattery100, HiOutlineCheckBadge } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "@/data/products";
import SectionDivider from "./SectionDivider";
import ModelCarousel from "./ModelCarousel";

const qualityPoints = [
  {
    icon: HiOutlineBattery100,
    /* "Al máximo de salud" prometía un 100% que un usado no da. El piso de 80%
       tampoco va en el título: puesto ahí ancla en el peor caso y el comprador
       asume que todos son 80. El titular vende el dato publicado; el piso
       queda abajo como garantía. */
    title: "La batería, con su número",
    desc: "En cada equipo publicamos la salud real de la batería. Ninguno sale a la venta por debajo del 80%.",
  },
  {
    icon: HiOutlineCheckBadge,
    title: "Probamos cada función",
    desc: "Cámaras, sensores, Face ID, parlantes. Si algo falla, no sale a la venta.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "60 días de garantía",
    desc: "Cubre cualquier falla de funcionamiento del equipo.",
  },
];

export default function QualityGallery({ products }: { products: Product[] }) {
  return (
    <section id="quality" className="relative py-16 md:py-20 bg-[#101010]">
      <SectionDivider edge="top" />
      <SectionDivider edge="bottom" />
      {/* Hero: Video + Quality Points */}
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16">
        <span className="section-badge mb-5">
          <HiOutlineCheckBadge aria-hidden="true" className="size-3.5" />
          Calidad A+
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-3 text-balance">
          Cada iPhone, verificado al 100%
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg text-pretty mb-8 md:mb-12">
          Revisamos cada equipo antes de publicarlo. El que ves en la foto es el que recibís.
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
                Así verificamos cada equipo antes de publicarlo
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
                    <Icon aria-hidden="true" className="size-5 sm:size-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm sm:text-base">{point.title}</h3>
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
              <FaWhatsapp aria-hidden="true" className="size-5" />
              <span className="font-medium text-sm sm:text-base">Pedí fotos reales antes de comprar</span>
            </a>
          </div>
        </div>
      </div>

      {/* Model carousel */}
      <ModelCarousel products={products} />
    </section>
  );
}
