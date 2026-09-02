"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { conditionInfo, type Product } from "@/data/products";

export default function ConditionExplainer({
  condition,
}: {
  condition: Product["condition"];
}) {
  const [open, setOpen] = useState(false);
  const info = conditionInfo[condition];

  return (
    <button
      onClick={() => setOpen(!open)}
      className="cursor-pointer w-full glass-panel rounded-xl p-4 text-left transition-all hover:bg-white/5 min-h-[44px]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white">{info.label}</p>
        <HiChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          {info.description}
        </p>
      )}
    </button>
  );
}
