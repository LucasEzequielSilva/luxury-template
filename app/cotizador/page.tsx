import type { Metadata } from "next";
import TradeInWizard from "@/components/TradeInWizard";

export const metadata: Metadata = {
  title: "Cotizador Plan Canje | IPHONES LUXURY",
  description:
    "Cotizá tu iPhone usado en segundos y recibí una oferta de canje. Seleccioná modelo, almacenamiento, batería y estado.",
  alternates: { canonical: "/cotizador" },
  /* El plan canje está apagado y sin link en la navegación: mientras siga así
     no tiene que aparecer en Google mandando gente a un flujo que no se usa.
     Cuando se reactive, sacar este bloque y volver a linkearlo desde el Footer. */
  robots: { index: false, follow: false },
};

export default function CotizadorPage() {
  return <TradeInWizard />;
}
