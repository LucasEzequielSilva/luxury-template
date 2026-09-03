import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://wbqenajvjesmoqzgskhu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicWVuYWp2amVzbW9xemdza2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzA3MTAsImV4cCI6MjA4OTk0NjcxMH0.Eb5odIrMZdheQ6ubIUemkZz7qnUXH0c13QCyEZK0st4";

// Reseñas de spam/vandalismo cargadas por el formulario público (contenido
// obsceno). El anon key no tiene permiso DELETE en Supabase (RLS), así que
// se filtran acá hasta que se borren desde el dashboard con el service role key.
const BLOCKED_REVIEW_IDS = new Set([
  "ee2dfa2f-b6ba-41f7-bf91-4c43b6932a85",
  "4db0bb3b-388d-4d08-ac76-491134e8d2f8",
  "980e28e4-0394-4c8b-8431-e4f3dae18763",
]);

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const filtered = Array.isArray(data)
      ? data.filter((r) => !BLOCKED_REVIEW_IDS.has(r.id))
      : data;
    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, device, rating, comment, date } = body;

    if (!name || !device || !rating || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ name, device, rating, comment: comment || null, date }),
    });

    const data = await res.json();
    return NextResponse.json(data[0] ?? data);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
