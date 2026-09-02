import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch("https://dolarhoy.com", {
      next: { revalidate: 0 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const html = await res.text();

    // Parse blue dollar sell rate from dolarhoy.com
    // Structure: div with "Dólar blue" title -> div.venta -> div.val with "$XXXX"
    const blueMatch = html.match(
      /[Dd]ólar\s*[Bb]lue[\s\S]*?class="venta"[\s\S]*?class="val"[^>]*>\s*\$\s*([\d.,]+)/i
    );

    // Spread financiera: +$20 sobre blue venta
    const FINANCIERA_SPREAD = 20;

    if (blueMatch) {
      const rate = parseFloat(blueMatch[1].replace(/\./g, "").replace(",", ".")) + FINANCIERA_SPREAD;
      return NextResponse.json({ rate, source: "dolarhoy.com", ok: true });
    }

    // Fallback: broader pattern looking for blue + venta val
    const altMatch = html.match(
      /[Bb]lue[\s\S]{0,500}?venta[\s\S]{0,300}?class="val"[^>]*>\s*\$\s*([\d.,]+)/i
    );

    if (altMatch) {
      const rate = parseFloat(altMatch[1].replace(/\./g, "").replace(",", ".")) + FINANCIERA_SPREAD;
      return NextResponse.json({ rate, source: "dolarhoy.com", ok: true });
    }

    // If scraping fails, return a fallback indicator
    return NextResponse.json({ rate: null, ok: false, error: "parse_failed" });
  } catch {
    return NextResponse.json({ rate: null, ok: false, error: "fetch_failed" });
  }
}
