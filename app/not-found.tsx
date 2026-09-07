import type { Metadata } from "next";

/* Next ya emite su propio noindex en el 404, pero el "index, follow" del
   layout también se hereda y quedaban dos directivas contradictorias: se pisa
   acá para que las dos digan lo mismo. */
export const metadata: Metadata = {
  title: "Página no encontrada | IPHONES LUXURY",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-slate-400 mb-8">Esta página no existe.</p>
      <a
        href="/"
        className="btn-gold px-6 py-3 rounded-full text-sm font-semibold"
      >
        Volver al inicio
      </a>
    </div>
  );
}
