import {
  HiOutlineUsers,
  HiOutlineTrophy,
  HiOutlineFingerPrint,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const stats = [
  { value: "+500", label: "Equipos vendidos", icon: HiOutlineUsers },
  { value: "100%", label: "Batería en cada equipo", icon: HiOutlineFingerPrint },
  { value: "24hs", label: "Entrega CABA y GBA", icon: HiOutlineTrophy },
  { value: "30 días", label: "Garantía incluida", icon: HiOutlineShieldCheck },
];

export default function Stats() {
  return (
    <section className="border-y border-white/5 bg-black/50 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-start gap-3 sm:gap-4">
            <stat.icon aria-hidden="true" className="size-5 sm:size-6 text-slate-500 mt-1 shrink-0" />
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-medium text-white tabular-nums text-balance">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-lg text-slate-500 text-pretty">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
