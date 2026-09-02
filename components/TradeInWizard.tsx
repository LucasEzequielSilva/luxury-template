"use client";

import { useState, useMemo, useCallback } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import Image from "next/image";
import {
  iphoneModels,
  damageOptions,
  interestedModels,
  calculateTradeInPrice,
  formatStorageLabel,
  buildWhatsAppMessage,
  getWhatsAppUrl,
  type IPhoneModel,
  type BatteryHealth,
} from "@/lib/iphone-data";
import { products, formatPrice } from "@/data/products";

const TOTAL_STEPS = 5;

/* ── sub-components ──────────────────────────────────── */

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i + 1 <= current ? "bg-amber-500 w-6" : "bg-white/10 w-4"
          }`}
        />
      ))}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors group"
    >
      <HiOutlineArrowLeft
        aria-hidden="true"
        className="size-4 group-hover:-translate-x-0.5 transition-transform"
      />
      Volver
    </button>
  );
}

function StepHint({ text }: { text: string }) {
  return <p className="text-xs text-slate-600 mt-4">{text}</p>;
}

/** Fixed bottom action bar with gradient fade */
function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="pointer-events-none h-8 bg-gradient-to-t from-black to-transparent" />
      <div className="bg-black px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 border-t border-white/5">
        <div className="max-w-xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── main wizard ─────────────────────────────────────── */

export default function TradeInWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
  const [batteryHealth, setBatteryHealth] = useState<BatteryHealth | null>(null);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [interestedModel, setInterestedModel] = useState("");

  const selectedModel = useMemo(
    () => iphoneModels.find((m) => m.name === selectedModelName),
    [selectedModelName]
  );

  const price = useMemo(() => {
    if (!selectedModel || selectedStorage === null || !batteryHealth) return null;
    return calculateTradeInPrice(selectedModel, selectedStorage, batteryHealth, selectedDamages);
  }, [selectedModel, selectedStorage, batteryHealth, selectedDamages]);

  const canSend = price !== null && price > 0 && name.trim() && interestedModel;

  const interestedDisplayName = interestedModel.includes("|")
    ? interestedModel.split("|").join(" (") + ")"
    : interestedModel;

  const whatsappMessage = canSend
    ? buildWhatsAppMessage(
        name.trim(),
        interestedDisplayName,
        selectedModelName,
        formatStorageLabel(selectedStorage!),
        price!
      )
    : "";

  const goTo = useCallback((s: number, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setStep(s);
    window.scrollTo({ top: 0 });
  }, []);

  const goBack = useCallback(() => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0 });
  }, []);

  const restart = useCallback(() => {
    setSelectedModelName("");
    setSelectedStorage(null);
    setBatteryHealth(null);
    setSelectedDamages([]);
    setName("");
    setInterestedModel("");
    goTo(1);
  }, [goTo]);

  const toggleDamage = (id: string) => {
    setSelectedDamages((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const modelGroups = useMemo(() => {
    const groups: { gen: string; models: IPhoneModel[] }[] = [];
    const genOrder = ["11", "12", "13", "14", "15", "16"];
    for (const gen of genOrder) {
      const models = iphoneModels.filter((m) => {
        if (gen === "16") return m.name.includes("16");
        return m.name.includes(gen) && !m.name.includes("16");
      });
      if (models.length) groups.push({ gen, models });
    }
    return groups;
  }, []);

  const animClass =
    direction === "forward"
      ? "animate-[wizardIn_0.35s_ease-out]"
      : "animate-[wizardBack_0.35s_ease-out]";

  // Steps 4 and 5 have fixed bottom bars, need extra padding
  const hasBottomBar = step === 4 || step === 5;

  return (
    <div className="min-h-dvh bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/90 backdrop-blur-md">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="iPhone Luxury" width={120} height={34} className="h-7 w-auto" />
        </a>
        <ProgressDots current={step} total={TOTAL_STEPS} />
      </header>

      {/* Content */}
      <main className={`flex-1 px-5 py-8 max-w-xl mx-auto w-full ${hasBottomBar ? "pb-28" : ""}`}>
        <div className={animClass}>
          {/* ─── Step 1: Model ─── */}
          {step === 1 && (
            <>
              <p className="text-sm text-amber-500 font-medium mb-2">Paso 1 de {TOTAL_STEPS}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                ¿Qué iPhone tenés?
              </h1>
              <p className="text-slate-500 text-sm mb-6">Tocá tu modelo para empezar.</p>

              <div className="space-y-5">
                {modelGroups.map(({ gen, models }) => (
                  <div key={gen}>
                    <p className="text-xs text-slate-600 uppercase tracking-widest mb-2">iPhone {gen}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {models.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => {
                            setSelectedModelName(m.name);
                            setSelectedStorage(null);
                            setSelectedDamages([]);
                            goTo(2, "forward");
                          }}
                          className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium text-left transition-all border bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/15 hover:bg-white/[0.06] active:scale-[0.97]"
                        >
                          {m.name.replace("iPhone ", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── Step 2: Storage ─── */}
          {step === 2 && selectedModel && (
            <>
              <BackButton onClick={goBack} />
              <p className="text-sm text-amber-500 font-medium mb-2 mt-6">Paso 2 de {TOTAL_STEPS}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                ¿Cuánto almacenamiento?
              </h1>
              <p className="text-slate-500 text-sm mb-8">
                Tu <span className="text-white">{selectedModelName}</span> — seleccioná la capacidad.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {selectedModel.storageOptions.map((gb) => (
                  <button
                    key={gb}
                    onClick={() => {
                      setSelectedStorage(gb);
                      goTo(3, "forward");
                    }}
                    className="cursor-pointer rounded-2xl px-6 py-5 text-left transition-all border bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.06] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span className="text-lg font-semibold text-white">{formatStorageLabel(gb)}</span>
                    {gb === selectedModel.baseStorage && (
                      <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">Base</span>
                    )}
                  </button>
                ))}
              </div>

              <StepHint text="Ajustes → General → Información → Capacidad" />
            </>
          )}

          {/* ─── Step 3: Battery ─── */}
          {step === 3 && (
            <>
              <BackButton onClick={goBack} />
              <p className="text-sm text-amber-500 font-medium mb-2 mt-6">Paso 3 de {TOTAL_STEPS}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Salud de batería
              </h1>
              <p className="text-slate-500 text-sm mb-8">¿Qué porcentaje muestra tu iPhone?</p>

              <div className="grid grid-cols-1 gap-3">
                {(
                  [
                    { value: "90-100" as BatteryHealth, label: "90–100%", desc: "Excelente", color: "text-amber-400" },
                    { value: "80-89" as BatteryHealth, label: "80–89%", desc: "Buena", color: "text-yellow-400" },
                    { value: "70-79" as BatteryHealth, label: "70–79%", desc: "Aceptable", color: "text-orange-400" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setBatteryHealth(opt.value);
                      goTo(4, "forward");
                    }}
                    className="cursor-pointer rounded-2xl px-6 py-5 text-left transition-all border bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.06] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span className="text-lg font-semibold text-white">{opt.label}</span>
                    <span className={`text-sm ${opt.color}`}>{opt.desc}</span>
                  </button>
                ))}
              </div>

              <StepHint text="Ajustes → Batería → Estado de la batería" />
            </>
          )}

          {/* ─── Step 4: Damages ─── */}
          {step === 4 && selectedModel && (
            <>
              <BackButton onClick={goBack} />
              <p className="text-sm text-amber-500 font-medium mb-2 mt-6">Paso 4 de {TOTAL_STEPS}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                ¿Tiene algún daño?
              </h1>
              <p className="text-slate-500 text-sm mb-6">Tocá los que apliquen. Si está perfecto, seguí de largo.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {damageOptions.map((damage) => {
                  const isActive = selectedDamages.includes(damage.id);
                  const discountAmount = damage.isScreenDamage
                    ? selectedModel.screenDamageDiscount
                    : damage.isFaceIdDamage
                    ? selectedModel.faceIdDiscount
                    : damage.discount;
                  return (
                    <button
                      key={damage.id}
                      onClick={() => toggleDamage(damage.id)}
                      className={`cursor-pointer flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm transition-all text-left border active:scale-[0.97] ${
                        isActive
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-white/[0.03] border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <HiOutlineExclamationTriangle
                          aria-hidden="true"
                          className={`size-4 shrink-0 ${isActive ? "text-red-400" : "text-slate-600"}`}
                        />
                        {damage.label}
                      </span>
                      <span className={`text-xs shrink-0 ${isActive ? "text-red-400" : "text-slate-600"}`}>
                        −${discountAmount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ─── Step 5: Result ─── */}
          {step === 5 && price !== null && (
            <>
              <BackButton onClick={goBack} />

              <div className="mt-6 mb-6">
                {price > 0 ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-amber-500 font-medium">Tu cotización</p>
                    <p
                      className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      USD {price}
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
                      <span className="bg-white/5 px-2.5 py-1 rounded-full">{selectedModelName}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-full">{formatStorageLabel(selectedStorage!)}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-full">Bat. {batteryHealth?.replace("-", "–")}%</span>
                      {selectedDamages.length > 0 && (
                        <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full">
                          {selectedDamages.length} daño{selectedDamages.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 text-center mt-3 space-y-0.5">
                      <p>El valor calculado es final según los datos cargados</p>
                      <p>Solo puede variar si hay fallas no declaradas</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-red-400">Los daños superan el valor del equipo.</p>
                    <a
                      href="https://wa.me/3757541930"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-600 transition-colors"
                    >
                      <FaWhatsapp aria-hidden="true" className="size-5" />
                      Contactanos para una evaluación
                    </a>
                    <div>
                      <button onClick={restart} className="cursor-pointer text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 mx-auto mt-4">
                        <HiOutlineArrowPath aria-hidden="true" className="size-4" />
                        Cotizar otro equipo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {price > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-slate-600 uppercase tracking-widest">Último paso</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <p className="text-sm text-slate-400 mb-4">
                    Completá tus datos y enviá la cotización.
                  </p>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors"
                      autoFocus
                    />
                    <select
                      value={interestedModel}
                      onChange={(e) => setInterestedModel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none cursor-pointer hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <option value="" className="bg-neutral-900">¿Qué modelo querés comprar?</option>
                      {(() => {
                        const options: { label: string; value: string }[] = [];
                        const seen = new Set<string>();
                        for (const model of interestedModels) {
                          const modelProducts = products.filter(
                            (p) => p.modelKey === model && p.category !== "android"
                          );
                          const conditions = new Set<string>(modelProducts.map((p) => p.condition));
                          if (conditions.size > 1) {
                            for (const cond of ["A+", "Sellado", "A"]) {
                              if (conditions.has(cond)) {
                                const key = `${model}|${cond}`;
                                if (!seen.has(key)) {
                                  seen.add(key);
                                  options.push({ label: `${model} (${cond})`, value: key });
                                }
                              }
                            }
                          } else if (modelProducts.length > 0) {
                            if (!seen.has(model)) {
                              seen.add(model);
                              options.push({ label: model, value: model });
                            }
                          }
                        }
                        return options.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-neutral-900">{opt.label}</option>
                        ));
                      })()}
                    </select>
                  </div>

                  {interestedModel && price != null && price > 0 && (() => {
                    const [modelKey, condFilter] = interestedModel.includes("|")
                      ? interestedModel.split("|")
                      : [interestedModel, null];
                    const targetProduct = products.find(
                      (p) =>
                        p.modelKey === modelKey &&
                        p.category !== "android" &&
                        (!condFilter || p.condition === condFilter)
                    );
                    if (!targetProduct) return null;
                    const displayName = condFilter ? `${modelKey} (${condFilter})` : modelKey;
                    const diff = targetProduct.price - price;
                    return (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4 animate-[wizardIn_0.25s_ease-out]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Diferencia estimada</span>
                          <span className="text-xs text-slate-600">{displayName} · {formatPrice(targetProduct.price)}</span>
                        </div>
                        {diff > 0 ? (
                          <p className="text-2xl font-bold text-white">
                            Abonás <span className="text-amber-400">{formatPrice(diff)}</span>
                          </p>
                        ) : (
                          <p className="text-lg font-semibold text-amber-400">
                            Tu equipo cubre el valor del {displayName}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-600 mt-1">
                          Cotización de tu equipo: {formatPrice(price)} · Precio {interestedModel}: {formatPrice(targetProduct.price)}
                        </p>
                      </div>
                    );
                  })()}

                  {canSend && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-[13px] text-slate-500 leading-relaxed animate-[wizardIn_0.25s_ease-out]">
                      {whatsappMessage}
                    </div>
                  )}

                  <button onClick={restart} className="cursor-pointer text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 mx-auto mt-5">
                    <HiOutlineArrowPath aria-hidden="true" className="size-4" />
                    Cotizar otro equipo
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* ─── Fixed bottom bar: Step 4 ─── */}
      {step === 4 && (
        <BottomBar>
          <button
            onClick={() => goTo(5, "forward")}
            className="cursor-pointer w-full py-4 rounded-2xl text-base font-bold transition-all bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {selectedDamages.length === 0 ? (
              <>
                <HiOutlineCheckCircle aria-hidden="true" className="size-5" />
                Sin daños — ver cotización
              </>
            ) : (
              <>
                Continuar con {selectedDamages.length} daño{selectedDamages.length > 1 ? "s" : ""}
              </>
            )}
          </button>
        </BottomBar>
      )}

      {/* ─── Fixed bottom bar: Step 5 (WhatsApp CTA) ─── */}
      {step === 5 && price !== null && price > 0 && (
        <BottomBar>
          <a
            href={canSend ? getWhatsAppUrl(whatsappMessage) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (!canSend) e.preventDefault(); }}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold transition-all ${
              canSend
                ? "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                : "bg-white/5 text-slate-600 cursor-not-allowed"
            }`}
          >
            <FaWhatsapp aria-hidden="true" className="size-5" />
            {!name.trim()
              ? "Ingresá tu nombre"
              : !interestedModel
              ? "Seleccioná qué modelo querés"
              : "Enviar por WhatsApp"
            }
          </a>
        </BottomBar>
      )}
    </div>
  );
}
