import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

async function activeShift(hotelId:string, username:string){
  const r=await supabaseRequest(`?select=id,employee_id,display_name&hotel_id=eq.${encodeURIComponent(hotelId)}&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&order=started_at.desc&limit=1`,{},"hotel_shifts");
  if(!r.ok)return null;
  return ((await r.json()) as Array<{id:string;employee_id:string|null;display_name:string}>)[0]??null;
}

function indiaDate(){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}
function indiaTime(){
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(new Date());
  const get=(type:string)=>parts.find(p=>p.type===type)?.value||"00";
  return `${get("hour")}:${get("minute")}:${get("second")}`;
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
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});

  const body = (await request.json().catch(() => ({}))) as {
    action?: "start_shift" | "end_shift" | "set_status";
    staffMemberId?: string; hotelId?: string; status?: "present" | "absent" | "leave" | "half_day";
    remarks?: string; correction?: boolean; correctionReason?: string;
  };
  const hotelId = hotelScope(session, body.hotelId);
  if (!hotelId || !body.staffMemberId) return NextResponse.json({ error: "Staff member and hotel are required." }, { status: 400 });

  const shift=await activeShift(hotelId,session.username);
  if(!shift)return NextResponse.json({error:"Start the receptionist shift before recording cleaning staff attendance."},{status:409});

  const date=indiaDate();
  const existingRes=await supabaseRequest(`?select=id,status,marked_at,recorded_by_employee_name,remarks,check_in_time,check_out_time&hotel_id=eq.${encodeURIComponent(hotelId)}&staff_member_id=eq.${encodeURIComponent(body.staffMemberId)}&attendance_date=eq.${date}&limit=1`,{},"hotel_staff_attendance");
  if(!existingRes.ok)return NextResponse.json({error:"Unable to verify existing attendance."},{status:500});
  const existing=(await existingRes.json() as Array<{id:string;status:string;marked_at:string|null;recorded_by_employee_name:string|null;remarks:string|null;check_in_time:string|null;check_out_time:string|null}>)[0];
  const now=new Date().toISOString();
  const time=indiaTime();

  if(body.action==="start_shift"){
    if(existing?.check_in_time)return NextResponse.json({error:"Cleaning staff shift is already started."},{status:409});
    if(existing&&existing.status!=="present")return NextResponse.json({error:"Attendance is already marked as absent/leave/half day. Use correction first."},{status:409});
    const payload={hotel_id:hotelId,staff_member_id:body.staffMemberId,attendance_date:date,status:"present",shift_label:null,check_in_time:time,check_out_time:null,remarks:body.remarks?.trim()||existing?.remarks||null,recorded_by:session.username,marked_at:existing?.marked_at||now,recorded_by_employee_id:shift.employee_id,recorded_by_employee_name:shift.display_name,shift_id:shift.id,updated_at:now};
    const response=await supabaseRequest("?on_conflict=staff_member_id,attendance_date",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(payload)},"hotel_staff_attendance");
    if(!response.ok)return NextResponse.json({error:"Unable to start cleaning staff shift."},{status:500});
    const row=(await response.json() as Array<{id:string}>)[0];
    await writeAuditLog(session,"cleaning_shift_started","staff_attendance",row?.id??existing?.id??null,hotelId,{staffMemberId:body.staffMemberId,checkInTime:time,recordedAt:now,employeeName:shift.display_name,shiftId:shift.id});
    return NextResponse.json({success:true,checkInTime:time});
  }

  if(body.action==="end_shift"){
    if(!existing||existing.status!=="present"||!existing.check_in_time)return NextResponse.json({error:"Start the cleaning staff shift first."},{status:409});
    if(existing.check_out_time)return NextResponse.json({error:"Cleaning staff shift is already ended."},{status:409});
    const response=await supabaseRequest(`?id=eq.${encodeURIComponent(existing.id)}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({check_out_time:time,updated_at:now})},"hotel_staff_attendance");
    if(!response.ok)return NextResponse.json({error:"Unable to end cleaning staff shift."},{status:500});
    await writeAuditLog(session,"cleaning_shift_ended","staff_attendance",existing.id,hotelId,{staffMemberId:body.staffMemberId,checkInTime:existing.check_in_time,checkOutTime:time,recordedAt:now,employeeName:shift.display_name,shiftId:shift.id});
    return NextResponse.json({success:true,checkOutTime:time});
  }

  if(!body.status)return NextResponse.json({error:"Attendance status is required."},{status:400});
  if(existing&&!body.correction)return NextResponse.json({error:"Attendance is already recorded. Use Correct Attendance with a reason."},{status:409});
  if(existing&&body.correction&&(!body.correctionReason||body.correctionReason.trim().length<3))return NextResponse.json({error:"Enter a correction reason."},{status:400});

  const payload={hotel_id:hotelId,staff_member_id:body.staffMemberId,attendance_date:date,status:body.status,shift_label:null,check_in_time:body.status==="present"?(existing?.check_in_time||time):null,check_out_time:body.status==="present"?(existing?.check_out_time||null):null,remarks:body.remarks?.trim()||null,recorded_by:session.username,marked_at:now,recorded_by_employee_id:shift.employee_id,recorded_by_employee_name:shift.display_name,shift_id:shift.id,updated_at:now};
  const response=await supabaseRequest("?on_conflict=staff_member_id,attendance_date",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(payload)},"hotel_staff_attendance");
  if(!response.ok)return NextResponse.json({error:"Unable to save attendance."},{status:500});
  const row=(await response.json() as Array<{id:string}>)[0];
  await writeAuditLog(session,existing?"attendance_corrected":"attendance_recorded","staff_attendance",row?.id??null,hotelId,{staffMemberId:body.staffMemberId,newStatus:body.status,markedAt:now,employeeName:shift.display_name,shiftId:shift.id,correctionReason:existing?body.correctionReason?.trim():undefined,previous:existing?{status:existing.status,markedAt:existing.marked_at,recordedByEmployee:existing.recorded_by_employee_name,remarks:existing.remarks,checkInTime:existing.check_in_time,checkOutTime:existing.check_out_time}:undefined});
  return NextResponse.json({success:true,attendance:row});
}
