import {
  HiOutlineShieldCheck,
  HiOutlineCheckBadge,
  HiOutlineTruck,
  HiOutlineLockClosed,
  HiOutlineGift,
  HiOutlineStar,
} from "react-icons/hi2";
import { IoGameControllerOutline } from "react-icons/io5";
import type { Product } from "@/data/products";

export default function TrustBadges({
  category,
  condition,
  productName,
  batteryHealth,
}: {
  category?: string;
  condition?: Product["condition"];
  productName?: string;
  batteryHealth?: number;
}) {
  const isIphone = !category || category === "iphone";
  const isConsola = category === "consolas";
  const isSellado = condition === "Sellado";
  const isPS5 = productName?.toLowerCase().includes("playstation");

  const badges: { icon: typeof HiOutlineShieldCheck; label: string }[] = [
    { icon: HiOutlineShieldCheck, label: "60 días de garantía IPHONES LUXURY" },
  ];

  /* Antes decía "Batería al 100%" en todo lo que no fuera consola, incluidos
     los usados: una promesa que un A+ no cumple. El sellado sí es 100% y el
     usado con dato muestra el suyo, que es el número que vende. Sin dato no se
     pone el piso de 80%: anclaría en el peor caso justo al lado del precio. */
  if (!isConsola) {
    const bateria = isSellado
      ? "Batería 100%"
      : batteryHealth
        ? `Batería ${batteryHealth}%`
        : "Batería revisada";
    badges.push({ icon: HiOutlineCheckBadge, label: bateria });
  }

  badges.push({ icon: HiOutlineTruck, label: "Entrega en el día" });
  badges.push({ icon: HiOutlineLockClosed, label: "Pago seguro" });

  if (isIphone) {
    badges.push({ icon: HiOutlineGift, label: "Accesorios de regalo" });
  }

  if (isSellado && isIphone) {
    badges.push({ icon: HiOutlineStar, label: "1 año de garantía Apple" });
  }

  if (isSellado && isConsola) {
    const brand = isPS5 ? "Sony" : "Nintendo";
    badges.push({ icon: HiOutlineStar, label: `1 año de garantía ${brand}` });
  }

  if (isPS5) {
    badges.push({ icon: IoGameControllerOutline, label: "1 joystick DualSense incluido" });
  }

  return (
    <div className="glass-panel rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex items-center gap-2">
              <Icon aria-hidden="true" className="size-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">{badge.label}</span>
            </div>
          );
        })}
      </div>
      {isIphone && (
        <p className="text-[11px] text-slate-500 text-center border-t border-white/5 pt-3">
          IMEI verificado y libre de bloqueo
        </p>
      )}
      {isPS5 && (
        <p className="text-[11px] text-slate-500 text-center border-t border-white/5 pt-3">
          El joystick adicional de la foto no está incluido
        </p>
      )}
    </div>
  );
}
