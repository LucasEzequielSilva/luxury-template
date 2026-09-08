"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { formatPrice, textoBateria, getWhatsAppLink, tituloEquipo, tituloCorto, type Product } from "@/data/products";
import { useCurrency } from "./CurrencyProvider";

export default function Featured({ products }: { products: Product[] }) {
  const { blueRate } = useCurrency();

  const items = products.filter((p) => p.featured).slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section id="featured" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-badge mb-4">
            <Star aria-hidden="true" className="size-3.5" />
            Destacados
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Los que más se venden
          </h2>
          <p className="text-slate-500 text-pretty">
            Los modelos que más eligen nuestros clientes por precio y rendimiento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((product) => {
            const hasImage = product.images && product.images.length > 0;
            const arsPrice = blueRate ? Math.round(product.price * blueRate) : null;
            const fullName = `${product.name} ${product.capacity} ${product.color}`;

            return (
              <div
                key={product.id}
                className="glass-panel rounded-xl overflow-hidden border-white/15 hover:border-white/25 transition-[border-color] group"
              >
                {/* Image / Color area */}
                <Link
                  href={`/producto/${product.id}`}
                  aria-label={`Ver ${fullName}`}
                  className="relative block"
                >
                  {hasImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                      <Image
                        src={product.images![0]}
                        alt={`${tituloEquipo(product)}, condición ${product.condition}`}
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
                      {tituloCorto(product)}
                    </Link>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {product.color.trim()}
                      {product.batteryHealth ? ` · ${textoBateria(product.batteryHealth, true)}` : ""}
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
                        aria-label={`Ver detalle de ${fullName}`}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] cursor-pointer"
                      >
                        Ver detalle
                        <FiArrowRight aria-hidden="true" className="size-3.5" />
                      </Link>
                      <a
                        href={getWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar por WhatsApp por el ${fullName}`}
                        className="btn-gold flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-full text-sm font-medium active:scale-95 transition-[transform,filter] cursor-pointer"
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
