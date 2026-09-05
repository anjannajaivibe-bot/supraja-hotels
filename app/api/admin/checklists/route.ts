import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

const CHECKLISTS = {
  shift_start: [
    ["front_desk_ready", "Front desk, phone and WhatsApp are ready"],
    ["cash_opening_verified", "Opening cash balance verified"],
    ["room_status_reviewed", "Room status and pending guest requests reviewed"],
    ["keys_checked", "Room keys and master key status checked"],
    ["pending_issues_reviewed", "Pending complaints and maintenance reviewed"],
    ["cleaning_staff_confirmed", "Cleaning/support staff availability confirmed"],
  ],
  daily: [
    ["lobby_clean", "Lobby and front desk cleanliness checked"],
    ["staff_attendance", "Cleaning/support staff attendance recorded"],
    ["room_status_current", "Room status is updated and current"],
    ["guest_requests", "Pending guest requests followed up"],
    ["maintenance_followup", "Open maintenance issues followed up"],
    ["complaints_followup", "Open guest complaints followed up"],
    ["safety_check", "Staircases, exits and common areas are clear and safe"],
    ["collections_updated", "Cash/UPI/card collection records are up to date"],
  ],
  shift_end: [
    ["cash_reconciled", "Cash, UPI and card collections reconciled"],
    ["room_status_verified", "Room status verified before handover"],
    ["pending_requests_noted", "Pending guest requests noted for next shift"],
    ["complaints_handed_over", "Open complaints handed over"],
    ["maintenance_handed_over", "Open maintenance issues handed over"],
    ["keys_accounted", "Room keys and master key accounted for"],
    ["attendance_complete", "Cleaning/support staff attendance completed"],
    ["handover_complete", "Shift handover notes completed"],
  ],
} as const;

type ChecklistType = keyof typeof CHECKLISTS;

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

async function activeShift(hotelId:string, username:string) {
  const r=await supabaseRequest(`?select=id,employee_id,display_name&hotel_id=eq.${encodeURIComponent(hotelId)}&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&order=started_at.desc&limit=1`,{},"hotel_shifts");
  if(!r.ok)return null;
  return ((await r.json()) as Array<{id:string;employee_id:string|null;display_name:string}>)[0]??null;
}

export async function GET(request:NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const hotelId=hotelScope(session,request.nextUrl.searchParams.get("hotelId"));
  if(!hotelId)return NextResponse.json({error:"Hotel required."},{status:400});
  const date=request.nextUrl.searchParams.get("date")||indiaDate();
  const shift=session.role==="hotel_admin"?await activeShift(hotelId,session.username):null;
  const dailyScope=`daily:${date}`;
  const shiftScope=shift?`shift:${shift.id}`:"";
  const scopeFilter=shiftScope?`&scope_key=in.(${encodeURIComponent(dailyScope)},${encodeURIComponent(shiftScope)})`:`&scope_key=eq.${encodeURIComponent(dailyScope)}`;
  const r=await supabaseRequest(`?select=*&hotel_id=eq.${encodeURIComponent(hotelId)}&checklist_date=eq.${date}${scopeFilter}`,{},"hotel_checklist_entries");
  if(!r.ok)return NextResponse.json({error:"Unable to load checklists."},{status:500});
  return NextResponse.json({templates:CHECKLISTS,entries:await r.json(),activeShift:shift,date});
}

export async function POST(request:NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});
  const body=await request.json().catch(()=>({})) as {checklistType?:ChecklistType;itemKey?:string;completed?:boolean;notes?:string};
  const type=body.checklistType;
  if(!type||!CHECKLISTS[type])return NextResponse.json({error:"Invalid checklist type."},{status:400});
  const item=CHECKLISTS[type].find(([key])=>key===body.itemKey);
  if(!item)return NextResponse.json({error:"Invalid checklist item."},{status:400});
  const shift=await activeShift(session.hotelId,session.username);
  if(!shift)return NextResponse.json({error:"Start a shift before updating checklists."},{status:409});
  const date=indiaDate();
  const scopeKey=type==="daily"?`daily:${date}`:`shift:${shift.id}`;
  const now=new Date().toISOString();
  const payload={hotel_id:session.hotelId,checklist_date:date,checklist_type:type,scope_key:scopeKey,item_key:item[0],item_label:item[1],is_completed:Boolean(body.completed),completed_at:body.completed?now:null,completed_by_employee_id:body.completed?shift.employee_id:null,completed_by_employee_name:body.completed?shift.display_name:null,shift_id:type==="daily"?null:shift.id,notes:body.notes?.trim()||null,recorded_by:session.username,updated_at:now};
  const r=await supabaseRequest("?on_conflict=hotel_id,scope_key,checklist_type,item_key",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(payload)},"hotel_checklist_entries");
  if(!r.ok)return NextResponse.json({error:"Unable to update checklist."},{status:500});
  const row=(await r.json())[0];
  await writeAuditLog(session,body.completed?"checklist_completed":"checklist_reopened","hotel_checklist",row?.id??null,session.hotelId,{checklistType:type,itemKey:item[0],employeeName:shift.display_name,shiftId:shift.id});
  return NextResponse.json({success:true,entry:row});
}
