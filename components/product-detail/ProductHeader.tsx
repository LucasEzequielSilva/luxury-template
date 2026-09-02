import type { Product } from "@/data/products";

const conditionStyles: Record<
  Product["condition"],
  { classes: string; dot: string }
> = {
  Sellado: {
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  "A+": {
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  A: {
    classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-400",
  },
};

export default function ProductHeader({ product }: { product: Product }) {
  const style = conditionStyles[product.condition];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border ${style.classes}`}
        >
          <span className={`size-1.5 rounded-full ${style.dot}`} />
          {product.condition}
        </span>
        <span className="text-xs text-slate-500">
          {product.capacity} &middot; {product.color}
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-tight text-balance">
        {product.category === "android" || product.category === "consolas" ? product.name : `Apple ${product.name}`}
      </h1>
    </div>
  );
}
