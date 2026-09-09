import { HiOutlineBanknotes } from "react-icons/hi2";

export default function PaymentMethods() {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <HiOutlineBanknotes aria-hidden="true" className="w-5 h-5 text-slate-300" />
        <h2 className="text-sm font-medium text-white">Medios de pago</h2>
      </div>
      {/* Mismo orden y mismos datos que el material del negocio: si acá dice
          otra cosa que en su flyer, el cliente no sabe a cuál creerle. */}
      <ul className="space-y-2.5 text-sm text-slate-400">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Transferencia
          <span className="text-yellow-400 font-medium ml-1">(+2,5% recargo)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Efectivo (ARS, USD o BRL)
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          Tarjeta de crédito (por Mercado Pago)
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">&#8226;</span>
          USDT
        </li>
      </ul>
    </div>
  );
}
