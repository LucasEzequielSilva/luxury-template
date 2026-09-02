"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------
const INTRO_DELAY = 200;
const TEXT_HOLD = 1200;
const EXIT_DURATION = 500;

type Phase = "void" | "brand" | "exit";

// ---------------------------------------------------------------------------
// Preload the GLB so it's cached for the hero
// ---------------------------------------------------------------------------
function useGLBPreload(url: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((r) => {
        if (r.ok) return r.blob();
      })
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, [url]);

  return ready;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<Phase>("void");
  const [visible, setVisible] = useState(true);
  const [animDone, setAnimDone] = useState(false);
  const modelReady = useGLBPreload("/iphone.glb");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      onComplete();
      return;
    }
    const id = setTimeout(() => setPhase("brand"), INTRO_DELAY);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "brand") {
      const id = setTimeout(() => setAnimDone(true), TEXT_HOLD);
      return () => clearTimeout(id);
    }
  }, [phase]);

  useEffect(() => {
    if (animDone && modelReady) {
      setPhase("exit");
      const id = setTimeout(() => setVisible(false), EXIT_DURATION);
      return () => clearTimeout(id);
    }
  }, [animDone, modelReady]);

  const isBrand = phase === "brand" || phase === "exit";

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          role="status"
          aria-label="Cargando iPhone Luxury"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex overflow-hidden">
              {"IPHONE LUXURY".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="text-5xl md:text-7xl font-bold tracking-widest"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), system-ui, sans-serif",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #c0c0c0 40%, #ffffff 55%, #a0a0a0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  initial={{ y: 28, opacity: 0 }}
                  animate={
                    isBrand
                      ? { y: 0, opacity: 1 }
                      : { y: 28, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: i * 0.045,
                    ease: "easeOut",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Underline */}
            <motion.div
              className="h-px mt-5 w-[140px] origin-center"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                isBrand
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: "easeOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
