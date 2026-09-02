import { HiOutlineBanknotes } from "react-icons/hi2";

export default function PaymentMethods() {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <HiOutlineBanknotes className="w-5 h-5 text-slate-300" />
        <h3 className="text-sm font-medium text-white">Medios de pago</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-400">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Efectivo (USD o ARS)
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Transferencia en pesos
          <span className="text-yellow-400 font-medium ml-1">(+3% recargo)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Transferencia en dólares
          <span className="text-yellow-400 font-medium ml-1">(+2% recargo)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Financiación: consultar por WhatsApp
        </li>
      </ul>
    </div>
  );
}
