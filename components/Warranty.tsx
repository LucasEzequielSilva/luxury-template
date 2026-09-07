import {
  HiOutlineShieldCheck,
  HiOutlineCheckBadge,
  HiOutlineTruck,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

const warranties = [
  {
    icon: HiOutlineShieldCheck,
    title: "60 días de garantía",
    description:
      "Si el equipo falla dentro de los 60 días, lo revisamos y, si hace falta, te lo cambiamos. Sin trámites largos.",
  },
  {
    icon: HiOutlineCheckBadge,
    title: "Revisión técnica completa",
    description:
      "Probamos batería, pantalla, sensores y conectividad antes de publicar el equipo.",
  },
  {
    icon: HiOutlineTruck,
    title: "Entrega en el día",
    description:
      "Si estás en Iguazú, coordinamos la entrega para el mismo día.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Atención por WhatsApp",
    description:
      "Te atiende una persona, no un bot, y te seguimos respondiendo después de la compra.",
  },
];

export default function Warranty() {
  return (
    <section id="warranty" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-badge mb-4">
            <HiOutlineShieldCheck aria-hidden="true" className="size-3.5" />
            Garantía
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Así te cubrimos
          </h2>
          <p className="text-sm text-slate-500">Soporte técnico nuestro durante toda la garantía.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {warranties.map((item) => (
            <div
              key={item.title}
              className="glass-panel rounded-xl p-5 sm:p-6 space-y-3 sm:space-y-4 hover:border-white/20 transition-[border-color]"
            >
              <div className="size-11 sm:size-12 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center">
                <item.icon aria-hidden="true" className="size-5 sm:size-6" style={{ color: "#d4a843" }} />
              </div>
              <h3 className="text-lg font-medium text-white text-balance">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
