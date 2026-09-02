import type { IPhoneSpecs } from "@/data/products";

interface Props {
  specs: IPhoneSpecs;
  capacity: string;
}

const specGroups: { title: string; rows: { label: string; key: keyof IPhoneSpecs | "capacity" }[] }[] = [
  {
    title: "Pantalla",
    rows: [
      { label: "Tamaño", key: "displaySize" },
      { label: "Tipo", key: "displayType" },
      { label: "Resolución", key: "resolution" },
      { label: "Tasa de refresco", key: "refreshRate" },
    ],
  },
  {
    title: "Rendimiento",
    rows: [
      { label: "Procesador", key: "chip" },
      { label: "Memoria RAM", key: "ram" },
      { label: "Almacenamiento", key: "capacity" },
      { label: "Sistema operativo", key: "os" },
    ],
  },
  {
    title: "Cámara",
    rows: [
      { label: "Cámara trasera", key: "mainCamera" },
      { label: "Cámara frontal", key: "frontCamera" },
      { label: "Video", key: "videoCapability" },
    ],
  },
  {
    title: "Batería y conectividad",
    rows: [
      { label: "Batería", key: "battery" },
      { label: "Resistencia al agua", key: "waterResistance" },
      { label: "Conectividad", key: "connectivity" },
    ],
  },
  {
    title: "General",
    rows: [
      { label: "Seguridad", key: "biometrics" },
      { label: "Peso", key: "weight" },
      { label: "Año de lanzamiento", key: "releaseYear" },
    ],
  },
];

export default function SpecsTable({ specs, capacity }: Props) {
  const getValue = (key: keyof IPhoneSpecs | "capacity") => {
    if (key === "capacity") return capacity;
    return String(specs[key]);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 text-balance">
        Especificaciones técnicas
      </h2>
      <div className="glass-panel rounded-2xl overflow-hidden">
        {specGroups.map((group, gi) => (
          <div key={group.title}>
            <div className="px-4 sm:px-6 py-3 bg-white/3">
              <h3 className="text-xs sm:text-sm font-medium text-slate-300 uppercase">
                {group.title}
              </h3>
            </div>
            {group.rows.map((row, ri) => (
              <div
                key={row.key}
                className={`flex items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-3.5 ${
                  ri < group.rows.length - 1 || gi < specGroups.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                <span className="text-xs sm:text-sm text-slate-500 shrink-0">{row.label}</span>
                <span className="text-xs sm:text-sm text-white text-right break-words min-w-0">
                  {getValue(row.key)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
