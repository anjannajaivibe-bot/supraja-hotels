import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { isLeadStatus, type HotelLead } from "@/lib/hotel-leads";
import { cleanText } from "@/lib/click-events";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const url = new URL(request.url);
  const days = [1, 7, 30, 90].includes(Number(url.searchParams.get("days"))) ? Number(url.searchParams.get("days")) : 30;
  const status = url.searchParams.get("status") ?? "all";
  const filters = new URLSearchParams({
    select: "*",
    created_at: `gte.${new Date(Date.now() - days * 86400000).toISOString()}`,
    order: "created_at.desc",
    limit: "1000",
  });
  if (isLeadStatus(status)) filters.set("status", `eq.${status}`);
  try {
    const response = await supabaseRequest(`?${filters}`, {}, "hotel_leads");
    if (!response.ok) return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
    return NextResponse.json({ leads: (await response.json()) as HotelLead[] });
  } catch {
    return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const status = body.status;
  if (!Number.isInteger(id) || !isLeadStatus(status)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const update = { status, notes: cleanText(body.notes, 2000) || null, updated_at: new Date().toISOString() };
  const response = await supabaseRequest(`?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(update) }, "hotel_leads");
  if (!response.ok) return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
  return NextResponse.json({ success: true });
}
