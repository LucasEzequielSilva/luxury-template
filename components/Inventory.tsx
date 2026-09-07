"use client";

import { useState, useMemo } from "react";
import { HiArrowsUpDown, HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

type Category = "iphone" | "android" | "consolas";
type SortOrder = "default" | "price-asc" | "price-desc";

/* conDivisorSuperior: ver el comentario de QualityGallery. Entre Calidad y
   Stock vive Destacados, que tiene fondo negro; si no hay destacados esa
   sección no se dibuja, las dos secciones grises quedan pegadas y los dos
   divisores se cruzan formando un ojo. */
export default function Inventory({
  products,
  conDivisorSuperior = true,
}: {
  products: Product[];
  conDivisorSuperior?: boolean;
}) {
  const [category, setCategory] = useState<Category>("iphone");
  const [sort, setSort] = useState<SortOrder>("default");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(INITIAL_COUNT);

  // One product per model, split by category
  const { iphoneModels, androidModels, consolaModels } = useMemo(() => {
    const seenIphone = new Map<string, Product>();
    const seenAndroid = new Map<string, Product>();
    const seenConsola = new Map<string, Product>();
    for (const p of products) {
      if (p.category === "android") {
        if (!seenAndroid.has(p.modelKey)) seenAndroid.set(p.modelKey, p);
      } else if (p.category === "consolas") {
        if (!seenConsola.has(p.modelKey)) seenConsola.set(p.modelKey, p);
      } else {
        if (!seenIphone.has(p.modelKey)) seenIphone.set(p.modelKey, p);
      }
    }
    return {
      iphoneModels: Array.from(seenIphone.values()),
      androidModels: Array.from(seenAndroid.values()),
      consolaModels: Array.from(seenConsola.values()),
    };
  }, [products]);

  const currentList = useMemo(() => {
    const base =
      category === "iphone"
        ? iphoneModels
        : category === "android"
        ? androidModels
        : consolaModels;

    let filtered = base;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = base.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelKey.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, sort, search, iphoneModels, androidModels, consolaModels]);

  const showMore = () => {
    setVisible((prev) => Math.min(prev + LOAD_MORE_COUNT, currentList.length));
  };

  const switchCategory = (cat: Category) => {
    setCategory(cat);
    setSort("default");
    setSearch("");
    setVisible(INITIAL_COUNT);
  };

  const cycleSort = () => {
    setSort((prev) =>
      prev === "default" ? "price-asc" : prev === "price-asc" ? "price-desc" : "default"
    );
    setVisible(INITIAL_COUNT);
  };

  const sortLabel =
    sort === "price-asc" ? "Menor precio" : sort === "price-desc" ? "Mayor precio" : "Precio";

  const hasMore = visible < currentList.length;

  const categories: { key: Category; label: string }[] = [
    { key: "iphone", label: "iPhone" },
    { key: "android", label: "Android" },
    { key: "consolas", label: "Consolas" },
  ];

  return (
    <section id="inventory" className="relative py-20 px-6 bg-[#101010]">
      {conDivisorSuperior && <SectionDivider edge="top" mirror />}
      <SectionDivider edge="bottom" shape="asymmetric" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="section-badge mb-4">
            <HiOutlineDevicePhoneMobile aria-hidden="true" className="size-3.5" />
            Stock
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Elegí el tuyo
          </h2>
          <p className="text-slate-500 mb-2 text-pretty">
            Todos los equipos están revisados y tienen 60 días de garantía. Las fotos son de cada equipo, no de catálogo.
          </p>
          <p className="text-xs text-slate-600">
            Si el modelo que querés no está en stock, lo conseguimos en 48 hs.
          </p>
        </div>

        {/* Category toggle + Search + Sort */}
        <div className="flex items-center justify-between gap-3 mb-10 flex-wrap">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => switchCategory(cat.key)}
                aria-pressed={category === cat.key}
                className={`cursor-pointer px-4 sm:px-6 py-2.5 min-h-[44px] rounded-full text-sm font-semibold uppercase transition-[border-color,background-color,color,filter] ${
                  category === cat.key
                    ? "btn-gold"
                    : "glass-panel border-white/10 text-slate-400 hover:border-[#d4a843]/40 hover:text-[#d4a843]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <HiOutlineMagnifyingGlass aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisible(INITIAL_COUNT);
                }}
                placeholder="Buscar..."
                aria-label="Buscar por modelo o color"
                className="w-32 sm:w-40 bg-white/[0.03] border border-white/10 rounded-full pl-9 pr-8 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:w-48 sm:focus:w-52 transition-all"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setVisible(INITIAL_COUNT);
                  }}
                  aria-label="Borrar la búsqueda"
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
                >
                  <HiOutlineXMark aria-hidden="true" className="size-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={cycleSort}
              aria-label={`Ordenar por precio (actual: ${sortLabel})`}
              className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-[border-color,background-color,color] ${
                sort !== "default"
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <HiArrowsUpDown aria-hidden="true" className="size-3.5" />
              <span className="hidden sm:inline">{sortLabel}</span>
            </button>
          </div>
        </div>

        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentList.slice(0, visible).map((product) => (
              <ProductCard key={product.id} product={product} allProducts={products} />
            ))}
          </div>
        ) : (
          /* Dos vacíos distintos. Con búsqueda cargada, el usuario buscó algo
             que no está. Sin búsqueda, no hay stock publicado en esa categoría:
             ahí el cartel de "no se encontraron resultados" no explica nada y
             deja la sección muerta, así que se ofrece el WhatsApp. */
          <div className="glass-panel rounded-xl p-10 sm:p-12 text-center">
            {search.trim() ? (
              <p className="text-slate-400">No se encontraron resultados para &ldquo;{search}&rdquo;</p>
            ) : (
              <>
                <p className="text-white font-medium">Estamos actualizando el stock</p>
                <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                  Escribinos y te decimos qué equipos tenemos disponibles hoy. Si el modelo que
                  buscás no está, lo conseguimos en 48 hs.
                </p>
                <a
                  href="https://wa.me/3757541930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center justify-center gap-2 mt-6 px-6 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide"
                >
                  Consultar por WhatsApp
                </a>
              </>
            )}
          </div>
        )}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={showMore}
              className="btn-outline-gold cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95 w-full sm:w-auto"
            >
              Ver más ({currentList.length - visible} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
