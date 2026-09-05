import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, verifyStoredPassword, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const filters = hotelId ? `&hotel_id=eq.${encodeURIComponent(hotelId)}` : "";
  const response = await supabaseRequest(`?select=*&order=started_at.desc&limit=30${filters}`, {}, "hotel_shifts");
  if (!response.ok) return NextResponse.json({ error: "Unable to load shifts." }, { status: 500 });
  return NextResponse.json({ shifts: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "hotel_admin" || !session.hotelId) {
    return NextResponse.json({ error: "Only hotel logins can start or end a shift." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string; note?: string; handoverNote?: string; employeeId?: string; pin?: string };

  if (body.action === "start") {
    if (!body.employeeId || !body.pin) return NextResponse.json({ error: "Select employee and enter employee PIN." }, { status: 400 });

    const activeResponse = await supabaseRequest(`?select=id&admin_username=eq.${encodeURIComponent(session.username)}&status=eq.active&limit=1`, {}, "hotel_shifts");
    const active = activeResponse.ok ? ((await activeResponse.json()) as { id: string }[]) : [];
    if (active.length) return NextResponse.json({ error: "This hotel already has an active shift." }, { status: 409 });

    const employeeRes = await supabaseRequest(`?select=id,name,pin_hash,is_active&id=eq.${encodeURIComponent(body.employeeId)}&limit=1`, {}, "hotel_employees");
    if (!employeeRes.ok) return NextResponse.json({ error: "Unable to verify employee." }, { status: 500 });
    const employee = (await employeeRes.json() as Array<{id:string;name:string;pin_hash:string;is_active:boolean}>)[0];
    if (!employee || !employee.is_active) return NextResponse.json({ error: "Employee is unavailable." }, { status: 409 });
    if (!verifyStoredPassword(body.pin.trim(), employee.pin_hash)) return NextResponse.json({ error: "Incorrect employee PIN." }, { status: 401 });

    const response = await supabaseRequest("?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        hotel_id: session.hotelId,
        admin_username: session.username,
        display_name: employee.name,
        employee_id: employee.id,
        start_note: body.note?.trim() || null,
      }),
    }, "hotel_shifts");
    if (!response.ok) return NextResponse.json({ error: "Unable to start shift." }, { status: 500 });
    const rows = (await response.json()) as { id: string }[];
    await writeAuditLog(session, "shift_started", "hotel_shift", rows[0]?.id ?? null, session.hotelId, { employeeId: employee.id, employeeName: employee.name });
    return NextResponse.json({ success: true, shift: rows[0] });
  }

  if (body.action === "end") {
    const activeResponse = await supabaseRequest(`?select=*&admin_username=eq.${encodeURIComponent(session.username)}&status=eq.active&order=started_at.desc&limit=1`, {}, "hotel_shifts");
    if (!activeResponse.ok) return NextResponse.json({ error: "Unable to load active shift." }, { status: 500 });
    const active = (await activeResponse.json()) as { id: string; hotel_id: string; employee_id?:string; display_name:string }[];
    if (!active[0]) return NextResponse.json({ error: "No active shift found." }, { status: 404 });

    const response = await supabaseRequest(`?id=eq.${active[0].id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        ended_at: new Date().toISOString(),
        status: "closed",
        end_note: body.note?.trim() || null,
        handover_note: body.handoverNote?.trim() || null,
      }),
    }, "hotel_shifts");
    if (!response.ok) return NextResponse.json({ error: "Unable to end shift." }, { status: 500 });
    await writeAuditLog(session, "shift_ended", "hotel_shift", active[0].id, session.hotelId, { employeeId: active[0].employee_id ?? null, employeeName: active[0].display_name });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
