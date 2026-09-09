"use client";

/* Último recurso: se muestra cuando falla el layout raíz mismo, así que
   renderiza fuera de él. Por eso lleva html, body y estilos en línea: acá no
   llega ni la tipografía ni el CSS global. Es la que reemplaza a la página
   blanca de "Application error" de Next. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es-AR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#cbd5e1",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420, width: "100%" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#d4a843", margin: "0 0 16px" }}>
            IPHONES LUXURY
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "#fff", margin: "0 0 12px" }}>
            Algo no cargó bien
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px" }}>
            Fue un problema de esta página, no de tu teléfono. Probá recargar. Si sigue igual,
            escribinos por WhatsApp y te pasamos el stock directo.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                cursor: "pointer",
                border: 0,
                borderRadius: 999,
                padding: "12px 24px",
                minHeight: 44,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#111",
                background: "linear-gradient(135deg, #fef48a 0%, #cfa534 40%, #ba810c 70%, #ddba4c 100%)",
              }}
            >
              Recargar
            </button>
            <a
              href="https://wa.me/3757541930"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "12px 24px",
                minHeight: 44,
                boxSizing: "border-box",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#d4a843",
                border: "1px solid rgba(212,168,67,0.6)",
                textDecoration: "none",
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
