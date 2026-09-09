"use client";

import { useState, useEffect } from "react";
import IntroLoader from "./IntroLoader";

export default function HomeClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    /* localStorage tira excepción en navegadores con datos de sitio
       bloqueados, como el interno de WhatsApp en algunos Android. Como esto
       corre dentro de un efecto, esa excepción llegaba al error boundary de
       Next y la home se reemplazaba por la página blanca de error. Si no se
       puede leer, se trata como ya visitado y se muestra la página directo. */
    let hasVisited: string | null = "1";
    try {
      hasVisited = localStorage.getItem("iphones_luxury_visited");
    } catch {}
    if (hasVisited) {
      setLoaderDone(true);
    } else {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    setShowLoader(false);
    try {
      localStorage.setItem("iphones_luxury_visited", "1");
    } catch {}
  };

  return (
    <>
      {showLoader && !loaderDone && (
        <IntroLoader onComplete={handleLoaderComplete} />
      )}
      {/* El HTML del servidor tiene que salir visible: con opacity:0 por defecto,
          cualquier rastreador o preview de link sin JS (y cualquier fallo de
          hidratación) veía la home en blanco. Solo se atenúa mientras el
          IntroLoader está efectivamente en pantalla. */}
      <div
        style={{
          opacity: showLoader && !loaderDone ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
