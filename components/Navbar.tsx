import { FaWhatsapp } from "react-icons/fa";

import MobileMenu from "./MobileMenu";
import ResellerModal from "./ResellerModal";

const links = [
  { label: "Stock", href: "/#inventory" },
  { label: "Destacados", href: "/#featured" },
  { label: "Garantía", href: "/#warranty" },
  // Cotizador / plan canje: lógica aparte, deshabilitada por ahora
  // { label: "Plan Canje", href: "/cotizador" },
];

export default function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-3 sm:mx-6 mt-3 max-w-5xl lg:mx-auto rounded-2xl border border-white/[0.06] bg-black">
        <div className="px-4 sm:px-5 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <div
              role="img"
              aria-label="IPHONES LUXURY"
              className="logo-gold w-[150px] h-[48px]"
            />
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <ResellerModal />
          </div>

          <a
            href="https://wa.me/3757541930"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden md:inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-full text-xs font-semibold uppercase"
          >
            <FaWhatsapp aria-hidden="true" className="size-4" />
            Contacto
          </a>

          <MobileMenu />
        </div>
      </nav>
    </div>
  );
}
