"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Product, products, formatPrice, getWhatsAppLink, getDiscountPercentage } from "@/data/products";
import { useCurrency } from "./CurrencyProvider";

const conditionStyles: Record<Product["condition"], string> = {
  Sellado: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "A+": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  A: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export default function ProductCard({ product }: { product: Product }) {
  const hasImage = product.images && product.images.length > 0;
  const { blueRate } = useCurrency();
  const discount = getDiscountPercentage(product);

  // Check if this model has multiple conditions
  const modelConditions = new Set(
    products.filter((p) => p.modelKey === product.modelKey).map((p) => p.condition)
  );
  const hasBothConditions = modelConditions.size > 1;

  const arsPrice = blueRate ? Math.round(product.price * blueRate) : null;

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col hover:border-white/20 transition-[border-color] group">
      {/* Image area */}
      <Link href={`/producto/${product.id}`} className="relative block">
        {hasImage ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
            <Image
              src={product.images![0]}
              alt={`${product.name} ${product.color}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div
            className="relative aspect-[4/3] flex items-center justify-center"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, ${product.colorHex}30 0%, transparent 60%),
                radial-gradient(ellipse at 70% 60%, ${product.colorHex}15 0%, transparent 50%),
                rgba(0,0,0,0.2)
              `,
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="size-16 rounded-full ring-2 ring-white/10 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: product.colorHex }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />
              </div>
              <span className="text-xs text-slate-500">{product.color}</span>
            </div>
          </div>
        )}
        {/* Condition badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {hasBothConditions ? (
            [...modelConditions].sort().map((cond) => (
              <span
                key={cond}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${conditionStyles[cond as Product["condition"]]}`}
              >
                {cond}
              </span>
            ))
          ) : (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${conditionStyles[product.condition]}`}
            >
              {product.condition}
            </span>
          )}
        </div>
        {/* Savings badge */}
        {discount != null && discount > 0 && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/90 text-white">
            -{discount}% vs nuevo
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div>
          <Link
            href={`/producto/${product.id}`}
            className="text-lg font-medium text-white hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-sm text-slate-400">
            {product.condition} · {product.capacity}
          </p>
        </div>
        <div className="mt-auto space-y-2">
          {/* Price */}
          {product.price > 0 ? (
            arsPrice ? (
              <div>
                <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums truncate">
                  ${new Intl.NumberFormat("de-DE").format(arsPrice)}
                </p>
                <p className="text-sm text-slate-500 tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>
            ) : (
              <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums truncate">
                {formatPrice(product.price)}
              </p>
            )
          ) : (
            <p className="text-lg font-medium text-slate-400">
              Consultar precio
            </p>
          )}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2">
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium hover:bg-amber-600 active:scale-95 transition-[transform,background-color] cursor-pointer"
            >
              <FaWhatsapp aria-hidden="true" className="size-4" />
              Consultar
            </a>
            <Link
              href={`/producto/${product.id}`}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors min-h-[44px] cursor-pointer"
            >
              Ver detalle
              <FiArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
