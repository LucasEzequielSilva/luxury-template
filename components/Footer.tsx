import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import ResellerModal from "./ResellerModal";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 sm:py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <span className="font-sf text-xl font-semibold text-white uppercase">
          iPhone Luxury
        </span>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
          <a
            href="https://wa.me/3757541930"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center cursor-pointer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" className="size-5" />
          </a>
          <a
            href="https://www.instagram.com/iphonesluxury/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-400 transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center cursor-pointer"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" className="size-5" />
          </a>
          <a href="/#inventory" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] inline-flex items-center px-2 cursor-pointer">
            Stock
          </a>
          <a href="/#warranty" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] inline-flex items-center px-2 cursor-pointer">
            Garantía
          </a>
          <a href="/cotizador" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] inline-flex items-center px-2 cursor-pointer">
            Plan Canje
          </a>
          <ResellerModal />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 text-center">
          © {new Date().getFullYear()} iPhone Luxury. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
