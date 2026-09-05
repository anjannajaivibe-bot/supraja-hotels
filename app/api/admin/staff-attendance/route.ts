import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

async function activeShift(hotelId:string, username:string){
  const r=await supabaseRequest(`?select=id,employee_id,display_name&hotel_id=eq.${encodeURIComponent(hotelId)}&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&order=started_at.desc&limit=1`,{},"hotel_shifts");
  if(!r.ok)return null;
  return ((await r.json()) as Array<{id:string;employee_id:string|null;display_name:string}>)[0]??null;
}

async function shiftStartComplete(hotelId:string, shiftId:string){
  const r=await supabaseRequest(`?select=item_key,is_completed&hotel_id=eq.${encodeURIComponent(hotelId)}&scope_key=eq.${encodeURIComponent(`shift:${shiftId}`)}&checklist_type=eq.shift_start&is_completed=eq.true`,{},"hotel_checklist_entries");
  if(!r.ok)return false;
  return ((await r.json()) as Array<{item_key:string}>).length>=6;
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const date = request.nextUrl.searchParams.get("date") || new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date());
  const hotelFilter = hotelId ? `&hotel_id=eq.${encodeURIComponent(hotelId)}` : "";
  const response = await supabaseRequest(`?select=*,hotel_staff_members(name,staff_type)&attendance_date=eq.${date}${hotelFilter}&order=created_at.desc`, {}, "hotel_staff_attendance");
  if (!response.ok) return NextResponse.json({ error: "Unable to load attendance." }, { status: 500 });
  return NextResponse.json({ attendance: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});

  const body = (await request.json().catch(() => ({}))) as {
    staffMemberId?: string; hotelId?: string; status?: "present" | "absent" | "leave" | "half_day";
    remarks?: string; correction?: boolean; correctionReason?: string;
  };
  const hotelId = hotelScope(session, body.hotelId);
  if (!hotelId || !body.staffMemberId || !body.status) return NextResponse.json({ error: "Staff member, hotel and status are required." }, { status: 400 });

  const shift=await activeShift(hotelId,session.username);
  if(!shift)return NextResponse.json({error:"Start a shift before recording staff attendance."},{status:409});
  if(!(await shiftStartComplete(hotelId,shift.id)))return NextResponse.json({error:"Complete the Shift Start checklist before recording attendance."},{status:409});

  const date=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date());
  const existingRes=await supabaseRequest(`?select=id,status,marked_at,recorded_by_employee_name,remarks&hotel_id=eq.${encodeURIComponent(hotelId)}&staff_member_id=eq.${encodeURIComponent(body.staffMemberId)}&attendance_date=eq.${date}&limit=1`,{},"hotel_staff_attendance");
  if(!existingRes.ok)return NextResponse.json({error:"Unable to verify existing attendance."},{status:500});
  const existing=(await existingRes.json() as Array<{id:string;status:string;marked_at:string|null;recorded_by_employee_name:string|null;remarks:string|null}>)[0];
  if(existing&&!body.correction)return NextResponse.json({error:"Attendance is already recorded. Use Correct Attendance with a reason."},{status:409});
  if(existing&&body.correction&&(!body.correctionReason||body.correctionReason.trim().length<3))return NextResponse.json({error:"Enter a correction reason."},{status:400});

  const now=new Date().toISOString();
  const payload={hotel_id:hotelId,staff_member_id:body.staffMemberId,attendance_date:date,status:body.status,shift_label:null,check_in_time:null,check_out_time:null,remarks:body.remarks?.trim()||null,recorded_by:session.username,marked_at:now,recorded_by_employee_id:shift.employee_id,recorded_by_employee_name:shift.display_name,shift_id:shift.id,updated_at:now};
  const response=await supabaseRequest("?on_conflict=staff_member_id,attendance_date",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(payload)},"hotel_staff_attendance");
  if(!response.ok)return NextResponse.json({error:"Unable to save attendance."},{status:500});
  const row=(await response.json() as Array<{id:string}>)[0];
  await writeAuditLog(session,existing?"attendance_corrected":"attendance_recorded","staff_attendance",row?.id??null,hotelId,{staffMemberId:body.staffMemberId,newStatus:body.status,markedAt:now,employeeName:shift.display_name,shiftId:shift.id,correctionReason:existing?body.correctionReason?.trim():undefined,previous:existing?{status:existing.status,markedAt:existing.marked_at,recordedByEmployee:existing.recorded_by_employee_name,remarks:existing.remarks}:undefined});
  return NextResponse.json({success:true,attendance:row});
}
