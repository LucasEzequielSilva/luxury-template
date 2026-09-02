"use client";

import Link from "next/link";
import {
  type Product,
  getSeriesModels,
  getColorVariants,
  getSeriesNumber,
  formatPrice,
} from "@/data/products";

function ModelSelector({ product }: { product: Product }) {
  const seriesModels = getSeriesModels(product);
  if (seriesModels.length <= 1) return null;

  const series = getSeriesNumber(product.name);

  const getTier = (name: string): string => {
    if (name.includes("Pro Max")) return "Pro Max";
    if (name.includes("Pro")) return "Pro";
    if (name.includes("Plus")) return "Plus";
    return "Base";
  };

  const getScreenHint = (name: string): string => {
    if (name.includes("Pro Max")) return '6.9"';
    if (name.includes("Plus")) return '6.7"';
    if (name.includes("Pro")) return '6.3"';
    return '6.1"';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 uppercase  font-medium">
          Serie iPhone {series}
        </p>
        <p className="text-xs text-slate-500">
          {seriesModels.length} modelos disponibles
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {seriesModels.map((model) => {
          const isActive = model.modelKey === product.modelKey;
          const tier = getTier(model.name);
          const screen = getScreenHint(model.name);

          return (
            <Link
              key={model.id}
              href={`/producto/${model.id}`}
              className={`relative rounded-xl p-3.5 transition-[border-color,background-color] border ${
                isActive
                  ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  : "glass-panel border-white/5 hover:border-white/15 hover:bg-white/3"
              }`}
            >
              {isActive && (
                <div className="absolute top-2.5 right-2.5 size-2 rounded-full bg-amber-400" />
              )}
              <div className="space-y-1.5">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {tier}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{screen}</span>
                  <span className="text-[11px] text-slate-600">·</span>
                  <span className="text-[11px] text-slate-500">
                    {model.condition}
                  </span>
                </div>
                <p
                  className={`text-xs font-medium ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  Desde {formatPrice(model.price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ColorSelector({ product }: { product: Product }) {
  const allVariants = getColorVariants(product);

  // One entry per unique color (first occurrence)
  const uniqueColors: Product[] = [];
  const seenColors = new Set<string>();
  for (const v of allVariants) {
    if (!seenColors.has(v.color)) {
      seenColors.add(v.color);
      uniqueColors.push(v);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 uppercase  font-medium">
          Color
        </p>
        <p className="text-sm text-slate-300">{product.color}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {uniqueColors.map((variant) => {
          const isActive = variant.color === product.color;
          return (
            <Link
              key={variant.id}
              href={`/producto/${variant.id}`}
              className={`group relative flex flex-col items-center gap-2 rounded-xl p-2.5 transition-[border-color,background-color] border ${
                isActive
                  ? "border-white/25 bg-white/5"
                  : "border-transparent hover:border-white/10 hover:bg-white/3"
              }`}
            >
              {/* Color swatch with metallic finish */}
              <div
                className={`size-10 sm:size-12 rounded-full transition-shadow relative overflow-hidden shadow-lg ${
                  isActive
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                    : "ring-1 ring-white/10 group-hover:ring-white/30"
                }`}
                style={{ backgroundColor: variant.colorHex }}
              >
                {/* Metallic sheen overlay */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.1) 60%, rgba(255,255,255,0.12) 100%)",
                  }}
                />
                {/* Inner glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  }}
                />
              </div>

              {/* Color name label */}
              <span
                className={`text-[9px] sm:text-[10px] leading-tight text-center max-w-14 ${
                  isActive ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {variant.color}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CapacitySelector({ product }: { product: Product }) {
  const allVariants = getColorVariants(product);

  // Get unique capacities for this model
  const capacities = new Map<string, Product>();
  for (const v of allVariants) {
    if (!capacities.has(v.capacity)) {
      capacities.set(v.capacity, v);
    }
  }
  if (capacities.size <= 1) return null;

  // For each capacity, find the product matching current color, or fallback
  const capacityOptions = Array.from(capacities.keys()).map((cap) => {
    const match = allVariants.find(
      (v) => v.capacity === cap && v.color === product.color
    );
    return match || allVariants.find((v) => v.capacity === cap)!;
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 uppercase  font-medium">
        Almacenamiento
      </p>
      <div className="flex flex-wrap gap-2">
        {capacityOptions.map((variant) => {
          const isActive = variant.capacity === product.capacity;
          return (
            <Link
              key={variant.id}
              href={`/producto/${variant.id}`}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-[border-color,background-color,color] border ${
                isActive
                  ? "bg-white/10 border-white/30 text-white"
                  : "glass-panel border-white/5 text-slate-400 hover:border-white/15 hover:text-white"
              }`}
            >
              {variant.capacity}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const conditionStyles: Record<string, string> = {
  Sellado: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "A+": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  A: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

function ConditionSelector({ product }: { product: Product }) {
  const allVariants = getColorVariants(product);

  // Find condition variants for the same color + capacity
  const conditionVariants = allVariants.filter(
    (v) => v.color === product.color && v.capacity === product.capacity
  );
  if (conditionVariants.length <= 1) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 uppercase font-medium">Condición</p>
      <div className="flex flex-wrap gap-2">
        {conditionVariants.map((variant) => {
          const isActive = variant.id === product.id;
          return (
            <Link
              key={variant.id}
              href={`/producto/${variant.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? conditionStyles[variant.condition]
                  : "glass-panel border-white/5 text-slate-400 hover:border-white/15 hover:text-white"
              }`}
            >
              {variant.condition} · {formatPrice(variant.price)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductVariants({ product }: { product: Product }) {
  if (product.category === "android") return null;

  const isConsola = product.category === "consolas";

  return (
    <div className="space-y-5 glass-panel rounded-2xl p-5">
      {!isConsola && <ModelSelector product={product} />}
      <ColorSelector product={product} />
      {!isConsola && <ConditionSelector product={product} />}
      {!isConsola && <CapacitySelector product={product} />}
    </div>
  );
}
