"use client";

import { FaWhatsapp, FaMobileAlt } from "react-icons/fa";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import IPhoneModel from "./IPhoneModel";
import { useCurrency } from "./CurrencyProvider";
import type { Product } from "@/data/products";

export default function Hero({ products }: { products: Product[] }) {
  const { blueRate } = useCurrency();
  const minPrice = Math.min(...products.filter((p) => p.category !== "android").map((p) => p.price));
  const arsMinPrice = blueRate ? Math.round(minPrice * blueRate) : null;

  return (
    <section className="relative lg:h-dvh pt-24 pb-12 lg:pb-0 px-4 sm:px-6 overflow-visible">
      {/* Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
      />
      {/* Gold glow behind the iPhone model for contrast against the black background */}
      <div
        className="absolute top-1/2 right-0 lg:right-[8%] -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.22) 0%, rgba(212,168,67,0.06) 45%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto w-full h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-6">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-5 lg:space-y-5 lg:py-8">
          {/* Price + Proof Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm font-medium text-slate-300">
            <span className="flex size-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-gold font-semibold tabular-nums">
              Desde {arsMinPrice ? `$${new Intl.NumberFormat("de-DE").format(arsMinPrice)}` : `US$${new Intl.NumberFormat("en-US").format(minPrice)}`}
            </span>
            <span className="text-slate-500">·</span>
            <span>+500 entregados</span>
          </div>

          {/* Heading */}
          <h1 className="text-[28px] sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight text-balance">
            El iPhone que buscás.
            <br />
            <span className="text-gold">
              Revisado y con garantía.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-slate-400 max-w-2xl font-light leading-relaxed text-pretty">
            Revisamos batería, pantalla y funciones antes de publicar cada equipo.
            Tenés 60 días de garantía y, si estás en Iguazú, te lo entregamos el
            mismo día. Todo se coordina por WhatsApp.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 w-full sm:w-auto">
            <a
              href="#inventory"
              className="btn-gold group w-full sm:w-auto px-7 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide active:scale-95 transition-[transform,filter] duration-150 flex items-center justify-center gap-2.5"
            >
              <FaMobileAlt aria-hidden="true" className="size-4" />
              Ver Stock Disponible
            </a>
            <a
              href="https://wa.me/3757541930"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-nowrap group w-full sm:w-auto px-7 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95 flex items-center justify-center gap-2.5"
            >
              <FaWhatsapp aria-hidden="true" className="size-4" />
              Consultar por WhatsApp
            </a>
          </div>

          {/* Micro-proof row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-1">
            {["60 días de garantía", "Entrega el mismo día", "Batería verificada"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400">
                <HiOutlineCheckCircle aria-hidden="true" className="size-4 shrink-0" style={{ color: "#d4a843" }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3D iPhone Model */}
        <div className="flex-1 lg:flex-[1.3] w-full overflow-visible relative lg:self-stretch">
          <IPhoneModel />
        </div>
      </div>
    </section>
  );
}
