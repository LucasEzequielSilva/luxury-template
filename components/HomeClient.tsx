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
    const hasVisited = localStorage.getItem("iPhone Luxury_visited");
    if (hasVisited) {
      setLoaderDone(true);
    } else {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    setShowLoader(false);
    localStorage.setItem("iPhone Luxury_visited", "1");
  };

  return (
    <>
      {showLoader && !loaderDone && (
        <IntroLoader onComplete={handleLoaderComplete} />
      )}
      <div
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
