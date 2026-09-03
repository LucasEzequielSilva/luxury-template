import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import MobileMenu from "./MobileMenu";
import BlueDollarTicker from "./BlueDollarTicker";
import ResellerModal from "./ResellerModal";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black">
      <BlueDollarTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-sf text-lg sm:text-xl font-semibold text-amber-500 uppercase tracking-wide">
            iPhone Luxury
          </span>
          <span className="font-sf text-lg sm:text-xl font-light text-white uppercase tracking-wide">
            Iguazú
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#inventory"
            className="text-sm font-medium hover:text-white transition-colors"
          >
            Stock
          </a>
          <a
            href="/#featured"
            className="text-sm font-medium hover:text-white transition-colors"
          >
            Destacados
          </a>
          <a
            href="/#warranty"
            className="text-sm font-medium hover:text-white transition-colors"
          >
            Garantía
          </a>
          {/* Cotizador / plan canje: lógica aparte, deshabilitada por ahora
          <a
            href="/cotizador"
            className="text-sm font-medium hover:text-white transition-colors"
          >
            Plan Canje
          </a>
          */}
          <ResellerModal />
        </div>

        <a
          href="https://wa.me/3757541930"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 min-h-[44px] rounded-full text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          <FaWhatsapp aria-hidden="true" className="size-4" />
          Contacto
          <FiArrowRight aria-hidden="true" className="size-4" />
        </a>

        <MobileMenu />
      </div>
    </nav>
  );
}
