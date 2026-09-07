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
    const hasVisited = localStorage.getItem("iphones_luxury_visited");
    if (hasVisited) {
      setLoaderDone(true);
    } else {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    setShowLoader(false);
    localStorage.setItem("iphones_luxury_visited", "1");
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
