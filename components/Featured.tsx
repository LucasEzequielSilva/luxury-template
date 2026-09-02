"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { products, formatPrice, getWhatsAppLink } from "@/data/products";
import { useCurrency } from "./CurrencyProvider";

const featuredPicks = [
  {
    id: "33",
    reason: "Mejor equilibrio entre precio, cámara de 48 MP y Dynamic Island.",
  },
  {
    id: "85",
    reason: "Máxima batería, pantalla 120 Hz y rendimiento premium sostenido.",
  },
  {
    id: "53",
    reason: "Última generación disponible, mayor vida útil y tecnología actual.",
  },
  {
    id: "28",
    reason: "Potencia de última gen en formato compacto con titanio y USB-C.",
  },
  {
    id: "12",
    reason: "La mejor puerta de entrada a Apple por rendimiento y precio.",
  },
  {
    id: "74",
    reason: "Opción económica confiable con buena batería y pantalla amplia.",
  },
];

export default function Featured() {
  const { blueRate } = useCurrency();

  const items = featuredPicks
    .map((pick) => {
      const product = products.find((p) => p.id === pick.id);
      return product ? { product, reason: pick.reason } : null;
    })
    .filter(Boolean) as { product: (typeof products)[number]; reason: string }[];

  return (
    <section id="featured" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-4 text-balance">
          Recomendados
        </h2>
        <p className="text-slate-500 mb-12 text-pretty">
          Los modelos que más recomendamos hoy por rendimiento y precio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(({ product, reason }) => {
            const hasImage = product.images && product.images.length > 0;
            const arsPrice = blueRate ? Math.round(product.price * blueRate) : null;

            return (
              <div
                key={product.id}
                className="glass-panel rounded-xl overflow-hidden border-white/15 hover:border-white/25 transition-[border-color] group"
              >
                {/* Image / Color area */}
                <Link href={`/producto/${product.id}`} className="relative block">
                  {hasImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                      <Image
                        src={product.images![0]}
                        alt={`${product.name} ${product.color}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div
                      className="relative aspect-[16/10] flex items-center justify-center"
                      style={{
                        background: `
                          radial-gradient(ellipse at 30% 40%, ${product.colorHex}35 0%, transparent 60%),
                          radial-gradient(ellipse at 70% 60%, ${product.colorHex}18 0%, transparent 50%),
                          rgba(0,0,0,0.15)
                        `,
                      }}
                    >
                      <div
                        className="size-20 rounded-full ring-2 ring-white/10 shadow-lg relative overflow-hidden"
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
                    </div>
                  )}
                  {/* Recomendado badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-yellow-400 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star aria-hidden="true" className="size-3.5 fill-yellow-400" />
                    <span className="text-xs font-medium uppercase">
                      Recomendado
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4">
                  <div>
                    <Link
                      href={`/producto/${product.id}`}
                      className="text-xl sm:text-2xl font-medium text-white hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {reason}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    {/* Price */}
                    <div>
                      {product.price > 0 ? (
                        arsPrice ? (
                          <>
                            <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums truncate">
                              ${new Intl.NumberFormat("de-DE").format(arsPrice)}
                            </p>
                            <p className="text-sm text-slate-500 tabular-nums">
                              {formatPrice(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums truncate">
                            {formatPrice(product.price)}
                          </p>
                        )
                      ) : (
                        <p className="text-lg font-medium text-slate-400">
                          Consultar precio
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <Link
                        href={`/producto/${product.id}`}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] cursor-pointer"
                      >
                        Ver detalle
                        <FiArrowRight aria-hidden="true" className="size-3.5" />
                      </Link>
                      <a
                        href={getWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-full text-sm font-medium hover:bg-amber-600 active:scale-95 transition-[transform,background-color] cursor-pointer"
                      >
                        <FaWhatsapp aria-hidden="true" className="size-4" />
                        Consultar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
