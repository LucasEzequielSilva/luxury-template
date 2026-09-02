import {
  HiOutlineShieldCheck,
  HiOutlineCheckBadge,
  HiOutlineTruck,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

const warranties = [
  {
    icon: HiOutlineShieldCheck,
    title: "Garantía de 30 días",
    description:
      "Si tu equipo presenta algún defecto de funcionamiento, un técnico lo revisa en el momento o te lo reemplazamos por otro.",
  },
  {
    icon: HiOutlineCheckBadge,
    title: "Batería al 100%",
    description:
      "Todos los equipos pasan por verificación técnica completa. Batería al 100%, pantalla, sensores y conectividad testeados.",
  },
  {
    icon: HiOutlineTruck,
    title: "Entrega en el día",
    description:
      "CABA y GBA en el día. Retiro en nuestra oficina de Ramos Mejía o envíos a todo el país.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Atención real por WhatsApp",
    description:
      "Hablás directo con nosotros, no con un bot. Respuesta en minutos y soporte post-venta incluido.",
  },
];

export default function Warranty() {
  return (
    <section id="warranty" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-3 text-balance">
          Por qué elegirnos
        </h2>
        <p className="text-sm text-slate-500 mb-12">Soporte técnico propio durante la garantía</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {warranties.map((item) => (
            <div
              key={item.title}
              className="glass-panel rounded-xl p-5 sm:p-6 space-y-3 sm:space-y-4 hover:border-white/20 transition-[border-color]"
            >
              <item.icon aria-hidden="true" className="size-7 sm:size-8 text-white shrink-0" />
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
