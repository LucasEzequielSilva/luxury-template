import type { Metadata } from "next";
import TradeInWizard from "@/components/TradeInWizard";

export const metadata: Metadata = {
  title: "Cotizador Plan Canje | iPhone Luxury",
  description:
    "Cotizá tu iPhone usado en segundos y recibí una oferta de canje. Seleccioná modelo, almacenamiento, batería y estado.",
};

export default function CotizadorPage() {
  return <TradeInWizard />;
}
