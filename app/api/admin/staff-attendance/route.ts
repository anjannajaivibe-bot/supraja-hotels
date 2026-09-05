import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function indiaTime() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
}

async function activeShiftForHotel(hotelId: string, username: string) {
  const response = await supabaseRequest(
    `?select=id,employee_id,display_name&hotel_id=eq.${encodeURIComponent(hotelId)}&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&order=started_at.desc&limit=1`,
    {},
    "hotel_shifts"
  );
  if (!response.ok) return null;
  return ((await response.json()) as Array<{ id:string; employee_id:string|null; display_name:string }>)[0] ?? null;
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const date = request.nextUrl.searchParams.get("date") || indiaDate();
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
    remarks?: string;
  };

  const hotelId = hotelScope(session, body.hotelId);
  if (!hotelId || !body.staffMemberId || !body.status) {
    return NextResponse.json({ error: "Staff member, hotel and status are required." }, { status: 400 });
  }

  let activeShift: { id:string; employee_id:string|null; display_name:string } | null = null;
  if (session.role === "hotel_admin") {
    activeShift = await activeShiftForHotel(hotelId, session.username);
    if (!activeShift) return NextResponse.json({ error: "Start a shift before recording staff attendance." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const date = body.date || indiaDate();
  const currentTime = indiaTime();
  const payload = {
    hotel_id: hotelId,
    staff_member_id: body.staffMemberId,
    attendance_date: date,
    status: body.status,
    shift_label: body.shiftLabel?.trim() || null,
    check_in_time: body.status === "present" || body.status === "half_day" ? currentTime : null,
    check_out_time: null,
    remarks: body.remarks?.trim() || null,
    recorded_by: session.username,
    marked_at: now,
    recorded_by_employee_id: activeShift?.employee_id ?? null,
    recorded_by_employee_name: activeShift?.display_name ?? (session.role === "master" ? "Master Admin" : null),
    shift_id: activeShift?.id ?? null,
    updated_at: now,
  };

  const response = await supabaseRequest("?on_conflict=staff_member_id,attendance_date", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(payload),
  }, "hotel_staff_attendance");
  if (!response.ok) return NextResponse.json({ error: "Unable to save attendance." }, { status: 500 });
  const rows = (await response.json()) as { id: string }[];
  await writeAuditLog(session, "attendance_recorded", "staff_attendance", rows[0]?.id ?? null, hotelId, {
    staffMemberId: body.staffMemberId,
    status: body.status,
    date,
    markedAt: now,
    employeeName: activeShift?.display_name ?? null,
    shiftId: activeShift?.id ?? null,
  });
  return NextResponse.json({ success: true, attendance: rows[0] });
}
