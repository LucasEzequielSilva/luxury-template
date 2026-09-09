import { HiOutlineTruck } from "react-icons/hi2";

export default function ShippingInfo() {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <HiOutlineTruck aria-hidden="true" className="w-5 h-5 text-slate-300" />
        <h2 className="text-sm font-medium text-white">Envío y entrega</h2>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-400">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Entrega en el día dentro de Iguazú
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Envíos a toda la provincia de Misiones
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Punto de encuentro y retiro a coordinar directo por WhatsApp
        </li>
      </ul>
    </div>
  );
}
