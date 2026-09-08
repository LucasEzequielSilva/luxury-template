"use client";

import { FaWhatsapp } from "react-icons/fa";
import { formatPrice, getWhatsAppLink, tituloCorto, tituloEquipo, type Product } from "@/data/products";

export default function StickyBottomBar({ product }: { product: Product }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate">
            {tituloCorto(product)}
          </p>
          <p className="text-lg text-white font-semibold">
            {formatPrice(product.price)}
          </p>
        </div>
        <a
          href={getWhatsAppLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por WhatsApp por el ${tituloEquipo(product)}`}
          className="btn-gold cursor-pointer shrink-0 flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full text-sm font-semibold"
        >
          <FaWhatsapp aria-hidden="true" className="w-5 h-5" />
          Consultar
        </a>
      </div>
    </div>
  );
}
