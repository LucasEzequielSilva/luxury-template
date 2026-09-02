import { HiOutlineTruck } from "react-icons/hi2";

export default function ShippingInfo() {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <HiOutlineTruck className="w-5 h-5 text-slate-300" />
        <h3 className="text-sm font-medium text-white">Envío y entrega</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-400">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Entrega en el día para CABA y GBA
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Envíos a todo el país por Correo Argentino o Andreani
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Retiro por nuestra oficina en Ramos Mejía
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Punto de encuentro a coordinar por WhatsApp
        </li>
      </ul>
    </div>
  );
}
