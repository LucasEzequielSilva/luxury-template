import { HiOutlineMapPin, HiOutlineTruck, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

const MAPS_QUERY = "Puerto Iguazú, Misiones, Argentina";
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=9&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
const WHATSAPP = "https://wa.me/3757541930?text=" + encodeURIComponent("Hola! Estoy en Iguazú, ¿coordinamos la entrega?");

const points = [
  {
    icon: HiOutlineTruck,
    title: "Entrega en el día dentro de Iguazú",
    desc: "Si estás en la ciudad, te lo llevamos hoy.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Punto de encuentro a coordinar",
    desc: "Lo coordinamos directo por WhatsApp: vos elegís dónde y a qué hora.",
  },
  /* "En el día" es sólo Iguazú; al resto de la provincia va por envío. Se
     dice aparte para no prometer mismo día en Posadas u Oberá. */
  {
    icon: HiOutlineMapPin,
    title: "Envíos a toda Misiones",
    desc: "Si estás en otra ciudad de la provincia, te lo mandamos. El envío se coordina por WhatsApp.",
  },
];

export default function Location() {
  return (
    <section id="ubicacion" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-badge mb-4">
            <HiOutlineMapPin aria-hidden="true" className="size-3.5" />
            Dónde estamos
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Estamos en Puerto Iguazú, Misiones
          </h2>
          <p className="text-slate-500 text-pretty">
            Atendemos en persona, entregamos en el día en la ciudad y enviamos a toda Misiones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {points.map((p) => (
              <div key={p.title} className="glass-panel rounded-2xl p-5 sm:p-6 flex gap-4 items-start">
                <div className="shrink-0 size-11 sm:size-12 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center">
                  <p.icon aria-hidden="true" className="size-5 sm:size-6" style={{ color: "#d4a843" }} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white text-balance">{p.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}

            <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase tracking-wide active:scale-95 transition-[transform,filter]"
              >
                <FaWhatsapp aria-hidden="true" className="size-4" />
                Coordinar entrega
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
              >
                <HiOutlineMapPin aria-hidden="true" className="size-4" />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 glass-panel rounded-2xl p-2 sm:p-3 min-h-[360px]">
            <div className="relative w-full h-full min-h-[340px] rounded-xl overflow-hidden bg-black">
              <iframe
                title="Mapa de Misiones con Puerto Iguazú marcado"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                style={{ filter: "invert(0.92) hue-rotate(180deg) grayscale(0.35) contrast(0.95)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
