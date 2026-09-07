import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import ResellerModal from "./ResellerModal";

export default function Footer() {
  return (
    <footer className="relative pt-28 pb-20 sm:pt-40 sm:pb-28 px-6">
      {/* Gold hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.6), transparent)" }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <a href="/" className="flex items-center" aria-label="Ir al inicio">
          <div role="img" aria-label="IPHONES LUXURY" className="logo-gold w-[150px] h-[48px]" />
        </a>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <a
            href="https://wa.me/3757541930"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-gold size-11"
            aria-label="WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" className="size-5" />
          </a>
          <a
            href="https://www.instagram.com/iphonesluxury/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-gold size-11"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" className="size-5" />
          </a>
          <a href="/#inventory" className="pill-gold px-5">
            Stock
          </a>
          <a href="/#warranty" className="pill-gold px-5">
            Garantía
          </a>
          {/* Cotizador / plan canje: lógica aparte, deshabilitada por ahora
          <a href="/cotizador" className="pill-gold px-5">
            Plan Canje
          </a>
          */}
          <ResellerModal className="pill-gold px-5" />
        </div>

        <p className="text-xs sm:text-sm text-[#d4a843]/60 text-center">
          © {new Date().getFullYear()} IPHONES LUXURY. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
