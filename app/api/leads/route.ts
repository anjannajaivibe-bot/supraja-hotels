import { NextResponse, type NextRequest } from "next/server";
import { normaliseLeadInput } from "@/lib/hotel-leads";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });
  }

  // Honeypot for simple form bots.
  if (body.company) return NextResponse.json({ success: true });
  const lead = normaliseLeadInput(body);
  if (!lead) return NextResponse.json({ error: "Please enter a valid name, phone number and hotel." }, { status: 400 });

  try {
    const response = await supabaseRequest("", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(lead),
    }, "hotel_leads");
    if (!response.ok) return NextResponse.json({ error: "Unable to save your enquiry. Please call or WhatsApp the hotel." }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save your enquiry. Please call or WhatsApp the hotel." }, { status: 500 });
  }
}
