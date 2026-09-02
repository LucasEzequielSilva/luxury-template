import { getRelatedProducts, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4);

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 text-balance">
        También te puede interesar
      </h2>
      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-x-visible md:pb-0">
        {related.map((p) => (
          <div key={p.id} className="min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
