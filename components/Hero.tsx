"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineArrowDown, HiOutlineUserGroup } from "react-icons/hi2";
import IPhoneModel from "./IPhoneModel";
import { useCurrency } from "./CurrencyProvider";
import { products } from "@/data/products";

const MIN_PRICE = Math.min(...products.filter((p) => p.category !== "android").map((p) => p.price));

export default function Hero() {
  const { blueRate } = useCurrency();
  const arsMinPrice = blueRate ? Math.round(MIN_PRICE * blueRate) : null;

  return (
    <section className="relative lg:h-dvh pt-28 pb-12 lg:pb-0 px-4 sm:px-6 overflow-visible">
      {/* Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto w-full h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-6">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-5 lg:space-y-5 lg:py-8">
          {/* Stock Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm font-medium text-slate-300">
            <span className="flex size-2 rounded-full bg-amber-500 shrink-0" />
            <span className="hidden sm:inline">Stock actualizado · Envíos a todo el país</span>
            <span className="sm:hidden">Stock · Envíos a todo el país</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight text-balance">
            Tu próximo iPhone,
            <br />
            <span className="text-slate-400">
              al mejor precio.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed text-pretty">
            iPhones verificados con batería al 100% y garantía incluida.
            Desde iPhone 11 hasta el 17 Pro Max, listos para entregar.
          </p>

          {/* Price anchor */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 justify-center lg:justify-start">
            {arsMinPrice ? (
              <>
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-amber-400 tabular-nums">
                  Desde ${new Intl.NumberFormat("de-DE").format(arsMinPrice)}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 tabular-nums">
                  (US${new Intl.NumberFormat("en-US").format(MIN_PRICE)})
                </span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-amber-400 tabular-nums">
                Desde US${new Intl.NumberFormat("en-US").format(MIN_PRICE)}
              </span>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 w-full sm:w-auto">
            <a
              href="#inventory"
              className="group w-full sm:w-auto px-7 py-3.5 min-h-[44px] bg-white text-black rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-white/90 active:scale-95 transition-[transform,background-color] duration-150 flex items-center justify-center gap-2.5"
            >
              Ver Catálogo
              <HiOutlineArrowDown aria-hidden="true" className="size-4 transition-transform duration-150 group-hover:translate-y-0.5" />
            </a>
            <a
              href="https://wa.me/3757541930"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-7 py-3.5 min-h-[44px] border border-white/15 text-white rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-white/5 active:scale-95 transition-[transform,background-color] duration-150 flex items-center justify-center gap-2.5"
            >
              <FaWhatsapp aria-hidden="true" className="size-4" />
              WhatsApp
            </a>
          </div>

          {/* Community CTA */}
          <a
            href="https://chat.whatsapp.com/JxhpRTtwQVcHBLNQjPeTKh"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5 min-h-[44px] hover:bg-white/[0.04] hover:border-white/12 transition-[background-color,border-color] duration-150"
          >
            <HiOutlineUserGroup aria-hidden="true" className="size-4 text-slate-400 shrink-0" />
            <span className="text-sm font-medium text-slate-300">
              Comunidad iPhone Luxury
            </span>
            <FiArrowRight aria-hidden="true" className="size-3.5 text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors duration-150" />
          </a>
        </div>

        {/* 3D iPhone Model */}
        <div className="flex-1 lg:flex-[1.3] w-full overflow-visible relative lg:self-stretch">
          <IPhoneModel />
        </div>
      </div>
    </section>
  );
}
