"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiOutlineXMark, HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/3757541930?text=" +
  encodeURIComponent(
    "Hola, quiero información para revender equipos me mandarias lista mayorista?"
  );

function ModalContent({ onClose }: { onClose: () => void }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-slate-500 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <HiOutlineXMark className="size-6" />
        </button>

        {/* Icon */}
        <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <HiOutlineBuildingStorefront className="size-6 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-medium text-white text-balance">
            Programa para revendedores
          </h3>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-pretty">
            Vendés iPhones o querés comenzar a revender? Accedé a precios
            mayoristas, stock actualizado y soporte directo para revendedores.
            Ideal para técnicos, tiendas y vendedores online.
          </p>
        </div>

        <p className="text-[11px] text-slate-600">
          Reposición garantizada en 48 hs — Stock constante para que nunca te quedes sin mercadería.
        </p>

        {/* CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-amber-500 text-white px-6 py-3.5 min-h-[44px] rounded-full text-sm font-semibold hover:bg-amber-600 active:scale-95 transition-[transform,background-color]"
        >
          <FaWhatsapp className="size-5" />
          Pedir lista mayorista
        </a>
      </div>
    </div>,
    document.body
  );
}

export default function ResellerModal({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          "cursor-pointer text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] inline-flex items-center px-2"
        }
      >
        Revendedores
      </button>

      {open && <ModalContent onClose={() => setOpen(false)} />}
    </>
  );
}
