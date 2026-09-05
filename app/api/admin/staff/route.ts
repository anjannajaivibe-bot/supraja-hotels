import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const filters = hotelId ? `&hotel_id=eq.${encodeURIComponent(hotelId)}` : "";
  const response = await supabaseRequest(`?select=*&is_active=eq.true&order=name.asc${filters}`, {}, "hotel_staff_members");
  if (!response.ok) return NextResponse.json({ error: "Unable to load staff." }, { status: 500 });
  return NextResponse.json({ staff: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { name?: string; phone?: string; staffType?: string; hotelId?: string };
  const hotelId = hotelScope(session, body.hotelId);
  if (!hotelId || !body.name?.trim()) return NextResponse.json({ error: "Hotel and staff name are required." }, { status: 400 });

  const response = await supabaseRequest("?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      hotel_id: hotelId,
      name: body.name.trim(),
      phone: body.phone?.trim() || null,
      staff_type: body.staffType?.trim() || "cleaning",
    }),
  }, "hotel_staff_members");
  if (!response.ok) return NextResponse.json({ error: "Unable to add staff member." }, { status: 500 });
  const rows = (await response.json()) as { id: string }[];
  await writeAuditLog(session, "staff_created", "staff_member", rows[0]?.id ?? null, hotelId, { name: body.name.trim() });
  return NextResponse.json({ success: true, staff: rows[0] });
}
