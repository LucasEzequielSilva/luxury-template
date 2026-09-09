"use client";

import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

/* Página de error de la app, dentro del layout: hereda la tipografía y el
   fondo negro. Antes no existía y cualquier excepción del cliente mostraba la
   página blanca por defecto de Next, con un mensaje en inglés que no le
   servía a nadie. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-20 bg-black text-slate-300">
      <div className="glass-panel rounded-2xl p-8 sm:p-10 max-w-md w-full text-center space-y-5">
        <p className="text-xs uppercase tracking-widest text-[#d4a843]">IPHONES LUXURY</p>
        <h1 className="text-2xl font-medium text-white text-balance">
          Algo no cargó bien
        </h1>
        <p className="text-sm text-slate-400 text-pretty">
          Fue un problema de esta página, no de tu teléfono. Probá recargar. Si sigue igual,
          escribinos por WhatsApp y te pasamos el stock directo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={reset}
            className="btn-gold cursor-pointer px-6 py-3 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide"
          >
            Recargar
          </button>
          <a
            href="https://wa.me/3757541930"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide"
          >
            <FaWhatsapp aria-hidden="true" className="size-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
