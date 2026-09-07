import { NextResponse } from "next/server";
import { getAjustes } from "@/lib/ajustes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* Última cotización que se pudo calcular. dolarhoy.com es una página que
   scrapeamos: si cambian el HTML o se cae un rato, sin esto el sitio dejaría
   de mostrar precios en pesos de golpe. Con el último valor bueno sigue
   mostrando, que es preferible a que el catálogo se quede solo en dólares. */
let ultimaBuena: { rate: number; source: string } | null = null;

function parsearBlue(html: string): number | null {
  /* dolarhoy: bloque "Dólar blue" -> div.venta -> div.val con "$XXXX". */
  const directo = html.match(
    /[Dd]ólar\s*[Bb]lue[\s\S]*?class="venta"[\s\S]*?class="val"[^>]*>\s*\$\s*([\d.,]+)/i
  );
  const alterno =
    directo ??
    html.match(/[Bb]lue[\s\S]{0,500}?venta[\s\S]{0,300}?class="val"[^>]*>\s*\$\s*([\d.,]+)/i);
  if (!alterno) return null;

  const valor = parseFloat(alterno[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(valor) ? valor : null;
}

export async function GET() {
  const ajustes = await getAjustes();

  /* La cotización manual gana siempre. Es la decisión del dueño y no tiene
     sentido mezclarla con el blue del día: si cargó un número, ese es el
     precio del dólar para su negocio hasta que lo borre. */
  if (ajustes.cotizacionManual !== null) {
    const manual = { rate: ajustes.cotizacionManual, source: "manual" as const };
    ultimaBuena = manual;
    return NextResponse.json({ ...manual, ok: true });
  }

  try {
    const res = await fetch("https://dolarhoy.com", {
      next: { revalidate: 0 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const blue = parsearBlue(await res.text());
    if (blue !== null) {
      const rate = Math.round((blue + ajustes.ajustePorDolar) * 100) / 100;
      ultimaBuena = { rate, source: "dolarhoy.com" };
      return NextResponse.json({ ...ultimaBuena, ok: true });
    }

    if (ultimaBuena) return NextResponse.json({ ...ultimaBuena, ok: true, stale: true });
    return NextResponse.json({ rate: null, ok: false, error: "parse_failed" });
  } catch {
    if (ultimaBuena) return NextResponse.json({ ...ultimaBuena, ok: true, stale: true });
    return NextResponse.json({ rate: null, ok: false, error: "fetch_failed" });
  }
}
