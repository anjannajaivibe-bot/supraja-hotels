import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, verifyStoredPassword, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

type ShiftType = "morning" | "night";

function shiftSchedule(shiftType: ShiftType) {
  const now = new Date();
  const ist = new Date(now.getTime() + 330 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const m = ist.getUTCMonth();
  const d = ist.getUTCDate();
  const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  let startY = y, startM = m, startD = d, startHour = shiftType === "morning" ? 9 : 21;

  if (shiftType === "night" && minutes < 9 * 60) {
    const previous = new Date(Date.UTC(y, m, d) - 24 * 60 * 60 * 1000);
    startY = previous.getUTCFullYear();
    startM = previous.getUTCMonth();
    startD = previous.getUTCDate();
  }

  const scheduledStart = new Date(Date.UTC(startY, startM, startD, startHour - 5, 30));
  const scheduledEnd = new Date(scheduledStart.getTime() + 12 * 60 * 60 * 1000);
  const lateMinutes = now > scheduledStart ? Math.max(1, Math.ceil((now.getTime() - scheduledStart.getTime()) / 60000)) : 0;
  return { now, scheduledStart, scheduledEnd, lateMinutes };
}

export async function GET(request: NextRequest) {
  const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const hotelId=hotelScope(session,request.nextUrl.searchParams.get("hotelId"));const filters=hotelId?`&hotel_id=eq.${encodeURIComponent(hotelId)}`:"";
  const response=await supabaseRequest(`?select=*&order=started_at.desc&limit=30${filters}`,{},"hotel_shifts");if(!response.ok)return NextResponse.json({error:"Unable to load shifts."},{status:500});return NextResponse.json({shifts:await response.json()});
}

export async function POST(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Only hotel logins can start or end a shift."},{status:403});
 const body=(await request.json().catch(()=>({}))) as {action?:string;note?:string;employeeId?:string;pin?:string;shiftType?:ShiftType;lateReason?:string};

 if(body.action==="start"){
  if(!body.employeeId||!body.pin||!body.shiftType)return NextResponse.json({error:"Select employee, shift and enter employee PIN."},{status:400});
  if(!["morning","night"].includes(body.shiftType))return NextResponse.json({error:"Invalid shift type."},{status:400});
  const ar=await supabaseRequest(`?select=id&admin_username=eq.${encodeURIComponent(session.username)}&status=eq.active&limit=1`,{},"hotel_shifts"),active=ar.ok?await ar.json() as {id:string}[]:[];if(active.length)return NextResponse.json({error:"This hotel already has an active shift."},{status:409});
  const er=await supabaseRequest(`?select=id,name,pin_hash,is_active&id=eq.${encodeURIComponent(body.employeeId)}&limit=1`,{},"hotel_employees");if(!er.ok)return NextResponse.json({error:"Unable to verify employee."},{status:500});const employee=(await er.json() as Array<{id:string;name:string;pin_hash:string;is_active:boolean}>)[0];if(!employee||!employee.is_active)return NextResponse.json({error:"Employee is unavailable."},{status:409});if(!verifyStoredPassword(body.pin.trim(),employee.pin_hash))return NextResponse.json({error:"Incorrect employee PIN."},{status:401});

  const schedule=shiftSchedule(body.shiftType);
  if(schedule.lateMinutes>0&&(!body.lateReason||body.lateReason.trim().length<3)){
    return NextResponse.json({error:`You are ${schedule.lateMinutes} minute${schedule.lateMinutes===1?"":"s"} late for the ${body.shiftType} shift. Enter the reason for late arrival.`,code:"LATE_REASON_REQUIRED",lateMinutes:schedule.lateMinutes,shiftType:body.shiftType},{status:409});
  }

  const payload={hotel_id:session.hotelId,admin_username:session.username,display_name:employee.name,employee_id:employee.id,start_note:body.note?.trim()||null,shift_type:body.shiftType,scheduled_start_at:schedule.scheduledStart.toISOString(),scheduled_end_at:schedule.scheduledEnd.toISOString(),is_late:schedule.lateMinutes>0,late_minutes:schedule.lateMinutes,late_reason:schedule.lateMinutes>0?body.lateReason?.trim()||null:null};
  const response=await supabaseRequest("?select=*",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)},"hotel_shifts");if(!response.ok)return NextResponse.json({error:"Unable to start shift."},{status:500});const rows=await response.json() as {id:string}[];
  await writeAuditLog(session,"shift_started","hotel_shift",rows[0]?.id??null,session.hotelId,{employeeId:employee.id,employeeName:employee.name,shiftType:body.shiftType,scheduledStartAt:schedule.scheduledStart.toISOString(),lateMinutes:schedule.lateMinutes,lateReason:schedule.lateMinutes>0?body.lateReason?.trim():null});
  return NextResponse.json({success:true,shift:rows[0],isLate:schedule.lateMinutes>0,lateMinutes:schedule.lateMinutes});
 }

 if(body.action==="end"){
  if(!body.pin)return NextResponse.json({error:"Enter your employee PIN to end the shift."},{status:400});
  const ar=await supabaseRequest(`?select=*&admin_username=eq.${encodeURIComponent(session.username)}&status=eq.active&order=started_at.desc&limit=1`,{},"hotel_shifts");if(!ar.ok)return NextResponse.json({error:"Unable to load active shift."},{status:500});const active=await ar.json() as {id:string;employee_id?:string;display_name:string}[];if(!active[0])return NextResponse.json({error:"No active shift found."},{status:404});if(!active[0].employee_id)return NextResponse.json({error:"This shift has no employee identity. Ask Master Admin to close it."},{status:409});
  const er=await supabaseRequest(`?select=id,name,pin_hash,is_active&id=eq.${encodeURIComponent(active[0].employee_id)}&limit=1`,{},"hotel_employees");if(!er.ok)return NextResponse.json({error:"Unable to verify employee PIN."},{status:500});const employee=(await er.json() as Array<{id:string;name:string;pin_hash:string;is_active:boolean}>)[0];if(!employee||!employee.is_active)return NextResponse.json({error:"Employee is unavailable. Ask Master Admin for assistance."},{status:409});if(!verifyStoredPassword(body.pin.trim(),employee.pin_hash))return NextResponse.json({error:"Incorrect employee PIN. The employee who started this shift must end it."},{status:401});
  const cr=await supabaseRequest(`?select=item_key&hotel_id=eq.${encodeURIComponent(session.hotelId)}&scope_key=eq.${encodeURIComponent(`shift:${active[0].id}`)}&checklist_type=eq.shift_end&is_completed=eq.true`,{},"hotel_checklist_entries");if(!cr.ok)return NextResponse.json({error:"Unable to verify Shift End checklist."},{status:500});const completed=(await cr.json() as {item_key:string}[]).length;
  if(completed<8){await writeAuditLog(session,"shift_end_blocked","hotel_shift",active[0].id,session.hotelId,{employeeId:active[0].employee_id,employeeName:active[0].display_name,shiftEndChecklistCompleted:completed,shiftEndChecklistRequired:8});return NextResponse.json({error:`Complete all Shift End checklist items before ending the shift (${completed}/8 completed).`,checklistIncomplete:true,shiftEndChecklistCompleted:completed},{status:409});}
  const response=await supabaseRequest(`?id=eq.${active[0].id}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({ended_at:new Date().toISOString(),status:"closed",end_note:body.note?.trim()||null})},"hotel_shifts");if(!response.ok)return NextResponse.json({error:"Unable to end shift."},{status:500});await writeAuditLog(session,"shift_ended","hotel_shift",active[0].id,session.hotelId,{employeeId:active[0].employee_id,employeeName:active[0].display_name,pinVerified:true,shiftEndChecklistCompleted:completed,shiftEndChecklistRequired:8});return NextResponse.json({success:true});
 }
 return NextResponse.json({error:"Invalid action."},{status:400});
}
