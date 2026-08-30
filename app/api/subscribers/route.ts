import { NextResponse, type NextRequest } from "next/server";
import { cleanText } from "@/lib/click-events";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = cleanText(body.email, 254).toLowerCase();
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 20).replace(/[^0-9+]/g, "");
    const sourcePage = cleanText(body.sourcePage, 500) || "/";
    const consentSource = cleanText(body.consentSource, 50) || "footer_form";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const response = await supabaseRequest("?on_conflict=email", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ email, name: name || null, phone: phone || null, source_page: sourcePage, consent_source: consentSource, consented_at: new Date().toISOString(), status: "active" }),
    }, "hotel_subscribers");
    if (!response.ok) return NextResponse.json({ error: "Unable to subscribe." }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to subscribe." }, { status: 500 });
  }
}
