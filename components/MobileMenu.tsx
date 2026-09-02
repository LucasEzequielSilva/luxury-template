"use client";

import { useState } from "react";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import ResellerModal from "./ResellerModal";

const links = [
  { label: "Stock", href: "/#inventory" },
  { label: "Destacados", href: "/#featured" },
  { label: "Garantía", href: "/#warranty" },
  { label: "Plan Canje", href: "/cotizador" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer text-white p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <HiOutlineXMark aria-hidden="true" className="size-7" />
        ) : (
          <HiOutlineBars3 aria-hidden="true" className="size-7" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 top-20 z-40 bg-black">
          <nav className="flex flex-col items-center gap-8 pt-16 px-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-slate-300 hover:text-white transition-colors py-2 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <ResellerModal className="text-2xl font-medium text-slate-300 hover:text-white transition-colors py-2 min-h-[44px] flex items-center cursor-pointer" />
            <a
              href="https://wa.me/3757541930"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center gap-2 bg-amber-500 text-white px-8 py-3 min-h-[44px] rounded-full text-lg font-medium hover:bg-amber-600 transition-colors"
            >
              <FaWhatsapp aria-hidden="true" className="size-5" />
              Contacto
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
