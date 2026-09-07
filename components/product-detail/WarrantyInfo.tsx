import { HiOutlineShieldCheck } from "react-icons/hi2";
import type { Product } from "@/data/products";

const warrantyByCondition: Record<Product["condition"], string[]> = {
  Sellado: [
    "Garantía oficial Apple",
    "60 días de garantía IPHONES LUXURY adicional",
    "Soporte post-venta incluido",
  ],
  "A+": [
    "60 días de garantía IPHONES LUXURY",
    "Cubre defectos de funcionamiento",
    "Soporte post-venta incluido",
  ],
  A: [
    "60 días de garantía IPHONES LUXURY",
    "Cubre defectos de funcionamiento",
    "Soporte post-venta incluido",
  ],
  /* La garantía es la misma para todos los usados: cubre funcionamiento, no
     estética. En B y C se dice explícito porque son los grados donde el
     desgaste visible es parte de lo que se compra. */
  B: [
    "60 días de garantía IPHONES LUXURY",
    "Cubre defectos de funcionamiento, no el desgaste estético",
    "Soporte post-venta incluido",
  ],
  C: [
    "60 días de garantía IPHONES LUXURY",
    "Cubre defectos de funcionamiento, no el desgaste estético",
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
        <HiOutlineShieldCheck aria-hidden="true" className="w-5 h-5 text-slate-300" />
        <h2 className="text-sm font-medium text-white">Garantía</h2>
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
