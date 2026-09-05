import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

type Hotel = { id: string; name: string; code: string };
type Shift = { id: string; hotel_id: string; display_name: string; started_at: string; status: string };
type Staff = { id: string; hotel_id: string };
type Attendance = { hotel_id: string; status: string };
type Checklist = { hotel_id: string; checklist_type: string; is_completed: boolean };
type Issue = { hotel_id: string; priority?: string };

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hotelsRes = await supabaseRequest("?select=id,name,code&is_active=eq.true&order=name.asc", {}, "hotels");
  if (!hotelsRes.ok) return NextResponse.json({ error: "Unable to load hotels." }, { status: 500 });
  const allHotels = (await hotelsRes.json()) as Hotel[];
  const hotels = session.role === "hotel_admin" ? allHotels.filter(h => h.id === session.hotelId) : allHotels;
  const ids = hotels.map(h => h.id);
  if (!ids.length) return NextResponse.json({ date: indiaDate(), hotels: [] });

  const inFilter = ids.map(encodeURIComponent).join(",");
  const date = indiaDate();
  const [shiftRes, staffRes, attendanceRes, checklistRes, complaintRes, maintenanceRes] = await Promise.all([
    supabaseRequest(`?select=id,hotel_id,display_name,started_at,status&hotel_id=in.(${inFilter})&status=eq.active`, {}, "hotel_shifts"),
    supabaseRequest(`?select=id,hotel_id&hotel_id=in.(${inFilter})&is_active=eq.true`, {}, "hotel_staff_members"),
    supabaseRequest(`?select=hotel_id,status&hotel_id=in.(${inFilter})&attendance_date=eq.${date}`, {}, "hotel_staff_attendance"),
    supabaseRequest(`?select=hotel_id,checklist_type,is_completed&hotel_id=in.(${inFilter})&checklist_date=eq.${date}`, {}, "hotel_checklist_entries"),
    supabaseRequest(`?select=hotel_id,priority&hotel_id=in.(${inFilter})&status=neq.resolved`, {}, "hotel_complaints"),
    supabaseRequest(`?select=hotel_id,priority&hotel_id=in.(${inFilter})&status=neq.resolved`, {}, "hotel_maintenance_tickets"),
  ]);

  if (![shiftRes, staffRes, attendanceRes, checklistRes, complaintRes, maintenanceRes].every(r => r.ok)) {
    return NextResponse.json({ error: "Unable to load today's operational summary." }, { status: 500 });
  }

  const shifts = await shiftRes.json() as Shift[];
  const staff = await staffRes.json() as Staff[];
  const attendance = await attendanceRes.json() as Attendance[];
  const checklists = await checklistRes.json() as Checklist[];
  const complaints = await complaintRes.json() as Issue[];
  const maintenance = await maintenanceRes.json() as Issue[];

  const summaries = hotels.map(hotel => {
    const shift = shifts.find(s => s.hotel_id === hotel.id) ?? null;
    const hotelStaff = staff.filter(s => s.hotel_id === hotel.id).length;
    const hotelAttendance = attendance.filter(a => a.hotel_id === hotel.id).length;
    const count = (type: string) => checklists.filter(c => c.hotel_id === hotel.id && c.checklist_type === type && c.is_completed).length;
    const openComplaints = complaints.filter(i => i.hotel_id === hotel.id);
    const openMaintenance = maintenance.filter(i => i.hotel_id === hotel.id);
    return {
      id: hotel.id,
      name: hotel.name,
      code: hotel.code,
      onDuty: shift ? { employeeName: shift.display_name, startedAt: shift.started_at, shiftId: shift.id } : null,
      cleaningStaff: { total: hotelStaff, marked: hotelAttendance },
      checklists: {
        shiftStart: { done: count("shift_start"), total: 6 },
        daily: { done: count("daily"), total: 8 },
        shiftEnd: { done: count("shift_end"), total: 8 },
      },
      issues: {
        complaints: openComplaints.length,
        maintenance: openMaintenance.length,
        critical: [...openComplaints, ...openMaintenance].filter(i => i.priority === "critical").length,
      },
    };
  });

  return NextResponse.json({ date, hotels: summaries });
}
