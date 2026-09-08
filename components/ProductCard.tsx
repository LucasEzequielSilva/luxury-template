"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Product, formatPrice, textoBateria, getWhatsAppLink, getDiscountPercentage, tituloEquipo, tituloCorto } from "@/data/products";
import { useCurrency } from "./CurrencyProvider";

const conditionStyles: Record<Product["condition"], string> = {
  Sellado: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "A+": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  A: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  B: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  C: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

export default function ProductCard({ product, allProducts = [] }: { product: Product; allProducts?: Product[] }) {
  const hasImage = product.images && product.images.length > 0;
  const { blueRate } = useCurrency();
  const discount = getDiscountPercentage(product);

  /* La grilla arma una tarjeta por modelo, no por unidad: si el negocio cargó
     tres iPhone 16 Pro Max, los tres caen acá adentro. Sin avisarlo, el
     visitante ve una sola foto y un solo precio, y encima el de la primera
     unidad que llegue, que puede ser la más cara del modelo. */
  const variantes = allProducts.filter((p) => p.modelKey === product.modelKey);
  const hayVariantes = variantes.length > 1;

  // Check if this model has multiple conditions
  const modelConditions = new Set(variantes.map((p) => p.condition));
  const hasBothConditions = modelConditions.size > 1;

  /* Un color por unidad, sin repetir: son los puntitos que muestran que el
     modelo viene en varios colores sin tener que entrar a la ficha. */
  const coloresVistos = new Set<string>();
  const colores = variantes.filter((v) => {
    const clave = v.color.trim().toLowerCase();
    if (!clave || coloresVistos.has(clave)) return false;
    coloresVistos.add(clave);
    return true;
  });
  const COLORES_VISIBLES = 4;

  /* "Desde" sólo si los precios del modelo difieren de verdad. Con todas las
     unidades al mismo precio, un "desde" es ruido. */
  const precios = variantes.map((v) => v.price).filter((p) => p > 0);
  const precioMinimo = precios.length > 0 ? Math.min(...precios) : 0;
  const hayRango = precios.length > 1 && precioMinimo !== Math.max(...precios);
  const precioMostrado = hayRango ? precioMinimo : product.price;

  const arsPrice = blueRate ? Math.round(precioMostrado * blueRate) : null;
  // Identidad completa de la unidad: sirve de alt de la foto y de nombre accesible
  // de los links, que si no se repiten como "Ver detalle" x N en la grilla.
  const fullName = tituloEquipo(product);

  return (
    <div className="glass-panel rounded-2xl p-3 flex flex-col hover:border-white/20 transition-[border-color] group shadow-lg shadow-black/20">
      {/* Image area */}
      <Link
        href={`/producto/${product.id}`}
        aria-label={`Ver ${fullName}`}
        className="relative block rounded-2xl overflow-hidden"
      >
        {hasImage ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/30">
            <Image
              src={product.images![0]}
              alt={`${fullName}, condición ${product.condition}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div
            className="relative aspect-[4/3] rounded-2xl flex items-center justify-center"
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
            {hayVariantes ? product.modelKey || product.name : tituloCorto(product)}
          </Link>
          <p className="text-sm text-slate-400">
            {hayVariantes ? (
              <>
                {product.condition} · {variantes.length} disponibles
              </>
            ) : (
              <>
                {/* La capacidad ya está en el título, acá va el color, que es
                    el dato que distingue a esta unidad de las demás. */}
                {[product.condition, product.color.trim()].filter(Boolean).join(" · ")}
                {product.batteryHealth ? ` · ${textoBateria(product.batteryHealth, true)}` : ""}
              </>
            )}
          </p>
          {colores.length > 1 && (
            <div
              className="flex items-center gap-1.5 mt-2"
              role="img"
              aria-label={`Colores disponibles: ${colores.map((c) => c.color).join(", ")}`}
            >
              {colores.slice(0, COLORES_VISIBLES).map((c) => (
                <span
                  key={c.id}
                  title={c.color}
                  className="size-3.5 rounded-full ring-1 ring-white/25 shadow-sm"
                  style={{ backgroundColor: c.colorHex }}
                />
              ))}
              {colores.length > COLORES_VISIBLES && (
                <span className="text-[11px] text-slate-500 tabular-nums">
                  +{colores.length - COLORES_VISIBLES}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="mt-auto space-y-2">
          {/* Price */}
          {precioMostrado > 0 ? (
            <div>
              {hayRango && (
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Desde
                </p>
              )}
              {arsPrice ? (
                <>
                  <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums truncate">
                    ${new Intl.NumberFormat("de-DE").format(arsPrice)}
                  </p>
                  <p className="text-sm text-slate-500 tabular-nums">
                    {formatPrice(precioMostrado)}
                  </p>
                </>
              ) : (
                <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums truncate">
                  {formatPrice(precioMostrado)}
                </p>
              )}
            </div>
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
              aria-label={`Consultar por WhatsApp por el ${fullName}`}
              className="btn-gold flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium active:scale-95 transition-[transform,filter] cursor-pointer"
            >
              <FaWhatsapp aria-hidden="true" className="size-4" />
              Consultar
            </a>
            <Link
              href={`/producto/${product.id}`}
              aria-label={`Ver detalle de ${fullName}`}
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
