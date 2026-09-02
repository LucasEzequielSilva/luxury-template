"use client";

import { useCurrency } from "./CurrencyProvider";

export default function BlueDollarTicker() {
  const { blueRate, loading } = useCurrency();

  if (loading || !blueRate) return null;

  return (
    <div className="w-full bg-amber-500/[0.06] border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-center gap-2 sm:gap-3 text-xs">
        <span className="flex size-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-amber-400 font-medium tabular-nums">
          Dólar Blue: ${new Intl.NumberFormat("de-DE").format(blueRate)}
        </span>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <span className="text-slate-500 hidden sm:inline">
          Todos los precios se actualizan en tiempo real
        </span>
        <span className="text-slate-500 sm:hidden">
          · Actualizado
        </span>
      </div>
    </div>
  );
}
