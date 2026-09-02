import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineClock, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineArrowPath } from "react-icons/hi2";
import { getWhatsAppLink, type Product } from "@/data/products";

export default function WhatsAppCTA({ product }: { product: Product }) {
  const isIphone = product.category !== "android";

  return (
    <div className="space-y-4">
      <a
        href={getWhatsAppLink(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer group w-full flex items-center justify-center gap-2.5 px-7 py-4 min-h-[48px] bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white rounded-full text-sm sm:text-base font-semibold uppercase transition-colors"
      >
        <FaWhatsapp aria-hidden="true" className="size-5" />
        Lo quiero — Consultar ahora
      </a>

      {isIphone && (
        <Link
          href="/cotizador"
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-slate-400 hover:text-white rounded-full text-xs sm:text-sm transition-[border-color,background-color,color]"
        >
          <HiOutlineArrowPath aria-hidden="true" className="size-4" />
          Entregá tu usado en parte de pago — Cotizalo
        </Link>
      )}

      {/* Urgency & trust micro-copy */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        <div className="flex flex-col items-center gap-1 py-2">
          <HiOutlineClock aria-hidden="true" className="size-4 text-amber-400" />
          <span className="text-[10px] text-slate-500 text-center leading-tight">
            Respuesta en minutos
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2">
          <HiOutlineBolt aria-hidden="true" className="size-4 text-amber-400" />
          <span className="text-[10px] text-slate-500 text-center leading-tight">
            Entrega en el día
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2">
          <HiOutlineShieldCheck aria-hidden="true" className="size-4 text-amber-400" />
          <span className="text-[10px] text-slate-500 text-center leading-tight">
            Garantía incluida
          </span>
        </div>
      </div>
    </div>
  );
}
