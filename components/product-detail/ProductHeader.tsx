import { textoBateria, tituloEquipo, type Product } from "@/data/products";

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
  /* B y C bajan en la escala de color igual que en la de estado: el comprador
     tiene que poder leer el grado sin leer la letra. */
  B: {
    classes: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
  C: {
    classes: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    dot: "bg-slate-400",
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
          <span aria-hidden="true" className={`size-1.5 rounded-full ${style.dot}`} />
          {product.condition}
        </span>
        {product.batteryHealth ? (
          <span className="text-xs text-slate-500">{textoBateria(product.batteryHealth!)}</span>
        ) : null}
      </div>
      {/* Capacidad y color van en el h1: hay un registro por variante, así que sin
          ellos decenas de URLs distintas comparten exactamente el mismo h1.
          tituloEquipo los agrega una sola vez, aunque ya estén en el nombre. */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-tight text-balance">
        {product.category === "android" || product.category === "consolas"
          ? tituloEquipo(product)
          : `Apple ${tituloEquipo(product)}`}
      </h1>
    </div>
  );
}
