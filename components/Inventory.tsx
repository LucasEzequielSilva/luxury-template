"use client";

import { useState, useMemo } from "react";
import { HiArrowsUpDown, HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

type Category = "iphone" | "android" | "consolas";
type SortOrder = "default" | "price-asc" | "price-desc";

export default function Inventory() {
  const [category, setCategory] = useState<Category>("iphone");
  const [sort, setSort] = useState<SortOrder>("default");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(INITIAL_COUNT);

  // One product per model, split by category
  const { iphoneModels, androidModels, consolaModels } = useMemo(() => {
    const seenIphone = new Map<string, (typeof products)[number]>();
    const seenAndroid = new Map<string, (typeof products)[number]>();
    const seenConsola = new Map<string, (typeof products)[number]>();
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
  }, []);

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
    <section id="inventory" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-4 text-balance">
          Stock disponible
        </h2>
        <p className="text-slate-500 mb-2 text-pretty">
          Todos los equipos con batería al 100%, verificados y con garantía de 30 días.
        </p>
        <p className="text-xs text-slate-600 mb-6">
          Reposición permanente — Si no está en stock, lo conseguimos en 48 hs.
        </p>

        {/* Category toggle + Search + Sort */}
        <div className="flex items-center justify-between gap-3 mb-10 flex-wrap">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => switchCategory(cat.key)}
                className={`cursor-pointer px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium border transition-[border-color,background-color,color] ${
                  category === cat.key
                    ? "bg-white text-black border-white"
                    : "glass-panel border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisible(INITIAL_COUNT);
                }}
                placeholder="Buscar..."
                className="w-32 sm:w-40 bg-white/[0.03] border border-white/10 rounded-full pl-9 pr-8 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:w-48 sm:focus:w-52 transition-all"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setVisible(INITIAL_COUNT);
                  }}
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
                >
                  <HiOutlineXMark className="size-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={cycleSort}
              className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-[border-color,background-color,color] ${
                sort !== "default"
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <HiArrowsUpDown className="size-3.5" />
              <span className="hidden sm:inline">{sortLabel}</span>
            </button>
          </div>
        </div>

        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentList.slice(0, visible).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-slate-400">No se encontraron resultados para &ldquo;{search}&rdquo;</p>
          </div>
        )}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={showMore}
              className="cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/5 active:scale-95 transition-[transform,background-color] duration-150 w-full sm:w-auto"
            >
              Ver más ({currentList.length - visible} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
