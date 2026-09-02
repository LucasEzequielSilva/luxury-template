"use client";

import { useCurrency } from "@/components/CurrencyProvider";

export default function CurrencyToggle() {
  const { currency, toggleCurrency, blueRate, loading } = useCurrency();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleCurrency}
        className="cursor-pointer relative flex items-center bg-white/5 rounded-full p-1 border border-white/10 min-h-[44px]"
      >
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currency === "USD"
              ? "bg-white text-black"
              : "text-slate-400"
          }`}
        >
          USD
        </span>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currency === "ARS"
              ? "bg-white text-black"
              : "text-slate-400"
          }`}
        >
          ARS
        </span>
      </button>
      {currency === "ARS" && blueRate && !loading && (
        <a
          href="https://dolarhoy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline decoration-dotted underline-offset-2"
        >
          Blue: ${ new Intl.NumberFormat("de-DE").format(blueRate)}
        </a>
      )}
    </div>
  );
}
