import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP =
  "https://wa.me/3757541930?text=" +
  encodeURIComponent("Hola! Vi la web de IPHONES LUXURY y quiero consultar por un iPhone.");

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 flex items-center gap-3"
    >
      <span className="hidden sm:block rounded-full border border-[#d4a843]/30 bg-[#0b0b0b]/90 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-[#d4a843] opacity-0 translate-x-2 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
        ¿Dudas? Escribinos
      </span>
      <span className="relative flex size-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#d4a843]/40 animate-ping motion-reduce:hidden"
        />
        <span className="btn-gold relative flex size-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(212,168,67,0.35)] transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
          <FaWhatsapp aria-hidden="true" className="size-7" />
        </span>
      </span>
    </a>
  );
}
