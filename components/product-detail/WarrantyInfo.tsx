import { HiOutlineShieldCheck } from "react-icons/hi2";
import type { Product } from "@/data/products";

const warrantyByCondition: Record<Product["condition"], string[]> = {
  Sellado: [
    "Garantía oficial Apple",
    "30 días de garantía iPhone Luxury adicional",
    "Soporte post-venta incluido",
  ],
  "A+": [
    "30 días de garantía iPhone Luxury",
    "Cubre defectos de funcionamiento",
    "Soporte post-venta incluido",
  ],
  A: [
    "30 días de garantía iPhone Luxury",
    "Cubre defectos de funcionamiento",
    "Soporte post-venta incluido",
  ],
};

export default function WarrantyInfo({
  condition,
}: {
  condition: Product["condition"];
}) {
  const items = warrantyByCondition[condition];

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <HiOutlineShieldCheck className="w-5 h-5 text-slate-300" />
        <h3 className="text-sm font-medium text-white">Garantía</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-400">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#8226;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
