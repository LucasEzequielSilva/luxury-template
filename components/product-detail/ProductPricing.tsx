"use client";

import { getDiscountPercentage, type Product } from "@/data/products";
import { useCurrency } from "@/components/CurrencyProvider";
import CurrencyToggle from "./CurrencyToggle";

export default function ProductPricing({ product }: { product: Product }) {
  const discount = getDiscountPercentage(product);
  const { formatPrice, currency, blueRate } = useCurrency();

  return (
    <div className="space-y-3">
      <CurrencyToggle />

      <div className="flex items-center gap-3 flex-wrap">
        {product.originalPrice && (
          <span className="text-base sm:text-lg text-slate-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {discount && (
          <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            -{discount}%
          </span>
        )}
      </div>

      <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
        {formatPrice(product.price)}
      </p>

      {/* Show the other currency as reference */}
      {blueRate && (
        <p className="text-sm text-slate-500">
          {currency === "USD"
            ? `≈ $${new Intl.NumberFormat("de-DE").format(Math.round(product.price * blueRate))} ARS`
            : `≈ US$${new Intl.NumberFormat("en-US").format(product.price)} USD`}
        </p>
      )}

      <p className="text-xs text-slate-600 leading-relaxed">
        Precio final en efectivo. Transferencia con recargo. Financiación disponible.
      </p>

      <p className="text-[11px] text-slate-500 pt-1">
        Listo para usar desde el primer día
      </p>
    </div>
  );
}
