"use client";

import Link from "next/link";
import {
  type Product,
  getSeriesModels,
  getColorVariants,
  getSeriesNumber,
  formatPrice,
  tituloCorto,
  textoBateria,
} from "@/data/products";

function ModelSelector({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const seriesModels = getSeriesModels(product, allProducts);
  if (seriesModels.length <= 1) return null;

  const series = getSeriesNumber(product.modelKey);

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
          const tier = getTier(model.modelKey);
          const screen = getScreenHint(model.modelKey);

          return (
            <Link
              key={model.id}
              href={`/producto/${model.id}`}
              aria-label={`Ver ${tituloCorto(model)} ${model.condition}`}
              aria-current={isActive ? "page" : undefined}
              className={`relative rounded-xl p-3.5 transition-[border-color,background-color] border ${
                isActive
                  ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  : "glass-panel border-white/5 hover:border-white/15 hover:bg-white/3"
              }`}
            >
              {isActive && (
                <div aria-hidden="true" className="absolute top-2.5 right-2.5 size-2 rounded-full bg-amber-400" />
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

function ColorSelector({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const allVariants = getColorVariants(product, allProducts);

  /* Una bolita por color, comparando sin espacios ni mayúsculas: el color se
     escribe a mano en el panel, así que "Blanco" y "Blanco " son el mismo y
     antes salían como dos bolitas blancas iguales.
     Entre las unidades de un mismo color se elige la de la capacidad que el
     visitante está mirando, para que cambiar de color no lo mueva de los
     256GB a los 512GB sin haberlo pedido. */
  const clave = (texto: string) => texto.trim().toLowerCase();
  const uniqueColors: Product[] = [];
  const seenColors = new Set<string>();
  for (const v of allVariants) {
    const k = clave(v.color);
    if (seenColors.has(k)) continue;
    seenColors.add(k);
    const mismaCapacidad = allVariants.find(
      (otra) => clave(otra.color) === k && otra.capacity === product.capacity,
    );
    uniqueColors.push(mismaCapacidad ?? v);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 uppercase  font-medium">
          Color
        </p>
        <p className="text-sm text-slate-300">{product.color.trim()}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {uniqueColors.map((variant) => {
          const isActive = clave(variant.color) === clave(product.color);
          return (
            <Link
              key={variant.id}
              href={`/producto/${variant.id}`}
              aria-label={`Ver ${tituloCorto(variant)} en color ${variant.color.trim()}`}
              aria-current={isActive ? "page" : undefined}
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
                {variant.color.trim()}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CapacitySelector({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const allVariants = getColorVariants(product, allProducts);

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
      (v) => v.capacity === cap && v.color.trim().toLowerCase() === product.color.trim().toLowerCase()
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
              aria-label={`Ver la versión de ${variant.capacity}`}
              aria-current={isActive ? "page" : undefined}
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
  B: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  C: "bg-slate-500/10 text-slate-300 border-slate-500/30",
};

/* El negocio carga una fila por teléfono físico, no por variante de catálogo:
   puede tener dos blancos de 256GB que sólo se diferencian por la batería y el
   precio. Esta lista es la que deja llegar a cada uno de esos equipos; sin
   ella, el segundo blanco no tendría desde dónde abrirse, porque el círculo de
   color muestra un solo blanco. La comparación del color va sin espacios ni
   mayúsculas porque se escribe a mano. */
function ConditionSelector({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const allVariants = getColorVariants(product, allProducts);
  const clave = (texto: string) => texto.trim().toLowerCase();

  const conditionVariants = allVariants.filter(
    (v) => clave(v.color) === clave(product.color) && v.capacity === product.capacity
  );
  if (conditionVariants.length <= 1) return null;

  /* Dos equipos del mismo modelo, color y capacidad pueden ser idénticos
     también en condición, batería y precio: son dos teléfonos iguales en la
     mano del vendedor. Dos botones iguales no ayudan a elegir, así que se
     agrupan y se dice cuántos hay. Cuando se diferencian en algo, cada opción
     va por separado. */
  const firma = (v: Product) => [v.condition, v.batteryHealth ?? "-", v.price].join("|");
  const grupos: { rep: Product; cantidad: number }[] = [];
  const posiciones = new Map<string, number>();
  for (const v of conditionVariants) {
    const k = firma(v);
    const pos = posiciones.get(k);
    if (pos === undefined) {
      posiciones.set(k, grupos.length);
      grupos.push({ rep: v, cantidad: 1 });
    } else {
      grupos[pos].cantidad += 1;
      /* El representante pasa a ser la unidad que se está viendo, para que el
         estado activo se marque en el botón correcto. */
      if (v.id === product.id) grupos[pos].rep = v;
    }
  }

  const etiqueta = (v: Product) =>
    [
      v.condition,
      v.batteryHealth ? textoBateria(v.batteryHealth, true) : null,
      formatPrice(v.price),
    ]
      .filter(Boolean)
      .join(" · ");

  if (grupos.length === 1) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500 uppercase font-medium">
          Unidades disponibles
        </p>
        <p className="text-sm text-slate-300">
          Tenemos {conditionVariants.length} equipos iguales de esta versión.{" "}
          <span className="text-slate-500">{etiqueta(product)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 uppercase font-medium">
        Unidades disponibles
      </p>
      <div className="flex flex-wrap gap-2">
        {grupos.map(({ rep: variant, cantidad }) => {
          const isActive = variant.id === product.id;
          return (
            <Link
              key={variant.id}
              href={`/producto/${variant.id}`}
              aria-label={`Ver la unidad en condición ${variant.condition}${
                variant.batteryHealth ? `, ${textoBateria(variant.batteryHealth, true)}` : ""
              }, ${formatPrice(variant.price)}${cantidad > 1 ? `, ${cantidad} disponibles` : ""}`}
              aria-current={isActive ? "page" : undefined}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? conditionStyles[variant.condition]
                  : "glass-panel border-white/5 text-slate-400 hover:border-white/15 hover:text-white"
              }`}
            >
              {etiqueta(variant)}
              {cantidad > 1 && <span className="ml-1.5 text-slate-500">x{cantidad}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductVariants({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  if (product.category === "android") return null;

  const isConsola = product.category === "consolas";

  return (
    <div className="space-y-5 glass-panel rounded-2xl p-5">
      {!isConsola && <ModelSelector product={product} allProducts={allProducts} />}
      <ColorSelector product={product} allProducts={allProducts} />
      {!isConsola && <ConditionSelector product={product} allProducts={allProducts} />}
      {!isConsola && <CapacitySelector product={product} allProducts={allProducts} />}
    </div>
  );
}
