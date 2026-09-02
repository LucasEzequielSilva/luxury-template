"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlineBattery50,
  HiOutlineWrenchScrewdriver,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from "react-icons/hi2";
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

function StepNumber({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-full text-xs font-bold shrink-0 transition-colors ${
        done
          ? "bg-amber-500 text-white"
          : "bg-white/10 text-slate-400"
      }`}
    >
      {done ? "✓" : n}
    </span>
  );
}

export default function TradeInCalculator() {
  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
  const [batteryHealth, setBatteryHealth] = useState<BatteryHealth | null>(null);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [showDamages, setShowDamages] = useState(false);
  const [name, setName] = useState("");
  const [interestedModel, setInterestedModel] = useState("");

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  const selectedModel: IPhoneModel | undefined = useMemo(
    () => iphoneModels.find((m) => m.name === selectedModelName),
    [selectedModelName]
  );

  const handleModelChange = (modelName: string) => {
    setSelectedModelName(modelName);
    setSelectedStorage(null);
    setSelectedDamages([]);
    setShowDamages(false);
    if (modelName) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  };

  const handleStorageSelect = (gb: number) => {
    setSelectedStorage(gb);
    setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const handleBatterySelect = (health: BatteryHealth) => {
    setBatteryHealth(health);
    setTimeout(() => step4Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const toggleDamage = (damageId: string) => {
    setSelectedDamages((prev) =>
      prev.includes(damageId)
        ? prev.filter((d) => d !== damageId)
        : [...prev, damageId]
    );
  };

  const price = useMemo(() => {
    if (!selectedModel || selectedStorage === null || !batteryHealth) return null;
    return calculateTradeInPrice(selectedModel, selectedStorage, batteryHealth, selectedDamages);
  }, [selectedModel, selectedStorage, batteryHealth, selectedDamages]);

  // Scroll to price when it first appears
  const prevPrice = useRef<number | null>(null);
  useEffect(() => {
    if (price !== null && prevPrice.current === null) {
      setTimeout(() => priceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
    prevPrice.current = price;
  }, [price]);

  const canSend = price !== null && price > 0 && name.trim() && interestedModel;

  const whatsappMessage = canSend
    ? buildWhatsAppMessage(
        name.trim(),
        interestedModel,
        selectedModelName,
        formatStorageLabel(selectedStorage!),
        price!
      )
    : "";

  // Progress
  const stepsCompleted =
    (selectedModelName ? 1 : 0) +
    (selectedStorage !== null ? 1 : 0) +
    (batteryHealth ? 1 : 0) +
    (price !== null ? 1 : 0);

  return (
    <section id="trade-in" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center">
          ¿Cuánto vale tu iPhone?
        </h2>
        <p className="text-slate-400 text-center mb-4">
          Cotizá tu equipo en segundos y recibí una oferta de canje.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10 max-w-xs mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                stepsCompleted >= step ? "bg-amber-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Model */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <StepNumber n={1} done={!!selectedModelName} />
              <HiOutlineDevicePhoneMobile aria-hidden="true" className="size-4" />
              <span className="uppercase tracking-wider">¿Qué modelo tenés?</span>
            </label>
            <select
              value={selectedModelName}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none cursor-pointer hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-base"
            >
              <option value="" className="bg-neutral-900">Seleccioná tu modelo</option>
              {iphoneModels.map((m) => (
                <option key={m.name} value={m.name} className="bg-neutral-900">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Storage */}
          {selectedModel && (
            <div ref={step2Ref} className="glass-panel rounded-2xl p-5 space-y-3 animate-[fadeSlideIn_0.3s_ease-out]">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <StepNumber n={2} done={selectedStorage !== null} />
                <HiOutlineCpuChip aria-hidden="true" className="size-4" />
                <span className="uppercase tracking-wider">¿Cuánto almacenamiento?</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedModel.storageOptions.map((gb) => (
                  <button
                    key={gb}
                    onClick={() => handleStorageSelect(gb)}
                    className={`cursor-pointer flex-1 min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedStorage === gb
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25 scale-[1.02]"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/25 hover:bg-white/8"
                    }`}
                  >
                    {formatStorageLabel(gb)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Battery */}
          {selectedModel && selectedStorage !== null && (
            <div ref={step3Ref} className="glass-panel rounded-2xl p-5 space-y-3 animate-[fadeSlideIn_0.3s_ease-out]">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <StepNumber n={3} done={!!batteryHealth} />
                <HiOutlineBattery50 aria-hidden="true" className="size-4" />
                <span className="uppercase tracking-wider">Salud de batería</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(["90-100", "80-89", "70-79"] as BatteryHealth[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => handleBatterySelect(range)}
                    className={`cursor-pointer flex-1 min-w-[100px] px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      batteryHealth === range
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25 scale-[1.02]"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/25 hover:bg-white/8"
                    }`}
                  >
                    {range.replace("-", "–")}%
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500">Ajustes → Batería → Estado de la batería en tu iPhone</p>
            </div>
          )}

          {/* Step 4: Condition */}
          {price !== null && (
            <div ref={step4Ref} className="glass-panel rounded-2xl p-5 space-y-3 animate-[fadeSlideIn_0.3s_ease-out]">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <StepNumber n={4} done={true} />
                <HiOutlineWrenchScrewdriver aria-hidden="true" className="size-4" />
                <span className="uppercase tracking-wider">Estado del equipo</span>
              </label>

              {!showDamages && selectedDamages.length === 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <HiOutlineCheckCircle aria-hidden="true" className="size-5" />
                    Perfecto estado
                  </div>
                  <button
                    onClick={() => setShowDamages(true)}
                    className="cursor-pointer text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                  >
                    ¿Tiene algún daño?
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (selectedDamages.length === 0) {
                        setShowDamages(false);
                      }
                    }}
                    className="cursor-pointer flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Seleccioná los daños que tenga
                    {selectedDamages.length > 0 && (
                      <span className="ml-1 bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                        {selectedDamages.length}
                      </span>
                    )}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {damageOptions.map((damage) => {
                      const isActive = selectedDamages.includes(damage.id);
                      const discountAmount = damage.isScreenDamage
                        ? selectedModel!.screenDamageDiscount
                        : damage.isFaceIdDamage
                        ? selectedModel!.faceIdDiscount
                        : damage.discount;
                      return (
                        <button
                          key={damage.id}
                          onClick={() => toggleDamage(damage.id)}
                          className={`cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                            isActive
                              ? "bg-red-500/10 border border-red-500/40 text-red-400"
                              : "bg-white/[0.03] border border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <HiOutlineExclamationTriangle
                              aria-hidden="true"
                              className={`size-3.5 shrink-0 ${isActive ? "text-red-400" : "text-slate-600"}`}
                            />
                            <span className="text-[13px]">{damage.label}</span>
                          </span>
                          <span className={`text-[11px] shrink-0 ${isActive ? "text-red-400" : "text-slate-600"}`}>
                            −${discountAmount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDamages.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedDamages([]);
                        setShowDamages(false);
                      }}
                      className="cursor-pointer text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Limpiar daños
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Price display */}
          {price !== null && (
            <div ref={priceRef} className="animate-[fadeSlideIn_0.3s_ease-out]">
              {price > 0 ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center space-y-2">
                  <p className="text-sm text-slate-400">Valor estimado de tu equipo</p>
                  <p className="text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    USD {price}
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    {selectedModelName} · {formatStorageLabel(selectedStorage!)} · Batería {batteryHealth?.replace("-", "–")}%
                    {selectedDamages.length > 0 && ` · ${selectedDamages.length} daño${selectedDamages.length > 1 ? "s" : ""}`}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center space-y-2">
                  <p className="text-sm text-red-400">
                    Los daños superan el valor del equipo.
                  </p>
                  <a
                    href="https://wa.me/3757541930"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <FaWhatsapp aria-hidden="true" className="size-4" />
                    Contactanos para una evaluación personalizada
                  </a>
                </div>
              )}
            </div>
          )}

          {/* WhatsApp section — only shows after price */}
          {price !== null && price > 0 && (
            <div className="space-y-4 pt-2 animate-[fadeSlideIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500 uppercase tracking-widest">Enviá tu cotización</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <HiOutlineUser aria-hidden="true" className="size-3.5" />
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors text-sm"
                  />
                </div>

                {/* Interested model */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <HiOutlineShoppingCart aria-hidden="true" className="size-3.5" />
                    ¿Qué modelo querés?
                  </label>
                  <select
                    value={interestedModel}
                    onChange={(e) => setInterestedModel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  >
                    <option value="" className="bg-neutral-900">Seleccioná modelo</option>
                    {interestedModels.map((m) => (
                      <option key={m} value={m} className="bg-neutral-900">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message preview */}
              {canSend && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[13px] text-slate-400 leading-relaxed animate-[fadeSlideIn_0.2s_ease-out]">
                  {whatsappMessage}
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href={canSend ? getWhatsAppUrl(whatsappMessage) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold transition-all ${
                  canSend
                    ? "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-white/5 text-slate-500 cursor-not-allowed"
                }`}
                onClick={(e) => { if (!canSend) e.preventDefault(); }}
              >
                <FaWhatsapp aria-hidden="true" className="size-5" />
                {!name.trim() && !interestedModel
                  ? "Completá tu nombre y modelo deseado"
                  : !name.trim()
                  ? "Ingresá tu nombre"
                  : !interestedModel
                  ? "Seleccioná el modelo que querés"
                  : "Enviar cotización por WhatsApp"
                }
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
