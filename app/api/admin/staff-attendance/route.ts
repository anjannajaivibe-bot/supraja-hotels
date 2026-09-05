import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const hotelFilter = hotelId ? `&hotel_id=eq.${encodeURIComponent(hotelId)}` : "";
  const response = await supabaseRequest(`?select=*,hotel_staff_members(name,staff_type)&attendance_date=eq.${date}${hotelFilter}&order=created_at.desc`, {}, "hotel_staff_attendance");
  if (!response.ok) return NextResponse.json({ error: "Unable to load attendance." }, { status: 500 });
  return NextResponse.json({ attendance: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    staffMemberId?: string;
    hotelId?: string;
    date?: string;
    status?: "present" | "absent" | "leave" | "half_day";
    shiftLabel?: string;
    checkInTime?: string;
    checkOutTime?: string;
    remarks?: string;
  };

  const hotelId = hotelScope(session, body.hotelId);
  if (!hotelId || !body.staffMemberId || !body.status) {
    return NextResponse.json({ error: "Staff member, hotel and status are required." }, { status: 400 });
  }

  const date = body.date || new Date().toISOString().slice(0, 10);
  const payload = {
    hotel_id: hotelId,
    staff_member_id: body.staffMemberId,
    attendance_date: date,
    status: body.status,
    shift_label: body.shiftLabel?.trim() || null,
    check_in_time: body.checkInTime || null,
    check_out_time: body.checkOutTime || null,
    remarks: body.remarks?.trim() || null,
    recorded_by: session.username,
    updated_at: new Date().toISOString(),
  };

  const response = await supabaseRequest("?on_conflict=staff_member_id,attendance_date", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(payload),
  }, "hotel_staff_attendance");
  if (!response.ok) return NextResponse.json({ error: "Unable to save attendance." }, { status: 500 });
  const rows = (await response.json()) as { id: string }[];
  await writeAuditLog(session, "attendance_recorded", "staff_attendance", rows[0]?.id ?? null, hotelId, { staffMemberId: body.staffMemberId, status: body.status, date });
  return NextResponse.json({ success: true, attendance: rows[0] });
}
