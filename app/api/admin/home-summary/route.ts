import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
function mondayIst(){const now=new Date(),ist=new Date(now.getTime()+330*60000),day=ist.getUTCDay(),diff=day===0?-6:1-day;ist.setUTCDate(ist.getUTCDate()+diff);return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth()+1).padStart(2,"0")}-${String(ist.getUTCDate()).padStart(2,"0")}`}
type Hotel={id:string;name:string;code:string};
type Shift={id:string;hotel_id:string;display_name:string;started_at:string;status:string;shift_type?:string|null;is_late?:boolean;late_minutes?:number;late_reason?:string|null};
type Staff={id:string;hotel_id:string};
type Attendance={hotel_id:string;status:string};
type Checklist={hotel_id:string;checklist_type:string;item_key:string;is_completed:boolean;opening_cash_amount?:number|null};
type Issue={hotel_id:string;priority?:string};
type LaundryBatch={id:string;hotel_id:string;status:string};
type LaundryItem={batch_id:string;quantity_sent:number;quantity_received:number;rewash_qty:number;missing_qty:number;damaged_qty:number};
type InventoryCheck={id:string;hotel_id:string};
type InventoryCheckItem={check_id:string;expected_qty:number;physical_qty:number;condition:string};

export async function GET(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const hotelsRes=await supabaseRequest("?select=id,name,code&is_active=eq.true&order=name.asc",{},"hotels");if(!hotelsRes.ok)return NextResponse.json({error:"Unable to load hotels."},{status:500});
 const allHotels=await hotelsRes.json() as Hotel[],hotels=session.role==="hotel_admin"?allHotels.filter(h=>h.id===session.hotelId):allHotels,ids=hotels.map(h=>h.id);if(!ids.length)return NextResponse.json({date:indiaDate(),hotels:[]});
 const inFilter=ids.map(encodeURIComponent).join(","),date=indiaDate(),weekStart=mondayIst();
 const[shiftRes,staffRes,attendanceRes,complaintRes,maintenanceRes,laundryBatchRes,inventoryCheckRes]=await Promise.all([
  supabaseRequest(`?select=id,hotel_id,display_name,started_at,status,shift_type,is_late,late_minutes,late_reason&hotel_id=in.(${inFilter})&status=eq.active`,{},"hotel_shifts"),
  supabaseRequest(`?select=id,hotel_id&hotel_id=in.(${inFilter})&is_active=eq.true`,{},"hotel_staff_members"),
  supabaseRequest(`?select=hotel_id,status&hotel_id=in.(${inFilter})&attendance_date=eq.${date}`,{},"hotel_staff_attendance"),
  supabaseRequest(`?select=hotel_id,priority&hotel_id=in.(${inFilter})&status=neq.resolved`,{},"hotel_complaints"),
  supabaseRequest(`?select=hotel_id,priority&hotel_id=in.(${inFilter})&status=neq.resolved`,{},"hotel_maintenance_tickets"),
  supabaseRequest(`?select=id,hotel_id,status&hotel_id=in.(${inFilter})&status=neq.closed`,{},"hotel_laundry_batches"),
  supabaseRequest(`?select=id,hotel_id&hotel_id=in.(${inFilter})&week_start=eq.${weekStart}`,{},"hotel_inventory_checks")
 ]);
 if(![shiftRes,staffRes,attendanceRes,complaintRes,maintenanceRes,laundryBatchRes,inventoryCheckRes].every(r=>r.ok))return NextResponse.json({error:"Unable to load today's operational summary."},{status:500});

 let checklistRes=await supabaseRequest(`?select=hotel_id,checklist_type,item_key,is_completed,opening_cash_amount&hotel_id=in.(${inFilter})&checklist_date=eq.${date}`,{},"hotel_checklist_entries");
 let openingCashSupported=true;
 if(!checklistRes.ok){openingCashSupported=false;checklistRes=await supabaseRequest(`?select=hotel_id,checklist_type,item_key,is_completed&hotel_id=in.(${inFilter})&checklist_date=eq.${date}`,{},"hotel_checklist_entries")}
 if(!checklistRes.ok)return NextResponse.json({error:"Unable to load today's checklist summary."},{status:500});

 const shifts=await shiftRes.json() as Shift[],staff=await staffRes.json() as Staff[],attendance=await attendanceRes.json() as Attendance[],checklists=await checklistRes.json() as Checklist[],complaints=await complaintRes.json() as Issue[],maintenance=await maintenanceRes.json() as Issue[],laundryBatches=await laundryBatchRes.json() as LaundryBatch[],inventoryChecks=await inventoryCheckRes.json() as InventoryCheck[];
 let laundryItems:LaundryItem[]=[];if(laundryBatches.length){const batchIds=laundryBatches.map(b=>encodeURIComponent(b.id)).join(","),r=await supabaseRequest(`?select=batch_id,quantity_sent,quantity_received,rewash_qty,missing_qty,damaged_qty&batch_id=in.(${batchIds})`,{},"hotel_laundry_items");if(r.ok)laundryItems=await r.json()}
 let inventoryCheckItems:InventoryCheckItem[]=[];if(inventoryChecks.length){const checkIds=inventoryChecks.map(c=>encodeURIComponent(c.id)).join(","),r=await supabaseRequest(`?select=check_id,expected_qty,physical_qty,condition&check_id=in.(${checkIds})`,{},"hotel_inventory_check_items");if(r.ok)inventoryCheckItems=await r.json()}

 const summaries=hotels.map(hotel=>{
  const shift=shifts.find(s=>s.hotel_id===hotel.id)??null,hotelStaff=staff.filter(s=>s.hotel_id===hotel.id).length,hotelAttendance=attendance.filter(a=>a.hotel_id===hotel.id).length,hotelChecklists=checklists.filter(c=>c.hotel_id===hotel.id),count=(type:string)=>hotelChecklists.filter(c=>c.checklist_type===type&&c.is_completed).length,openingCashEntry=hotelChecklists.find(c=>c.checklist_type==="shift_start"&&c.item_key==="cash_opening_verified"&&c.is_completed),openComplaints=complaints.filter(i=>i.hotel_id===hotel.id),openMaintenance=maintenance.filter(i=>i.hotel_id===hotel.id);
  const hotelLaundry=laundryBatches.filter(b=>b.hotel_id===hotel.id),hotelBatchIds=new Set(hotelLaundry.map(b=>b.id)),unresolvedLaundry=laundryItems.filter(i=>hotelBatchIds.has(i.batch_id)).reduce((sum,i)=>sum+Math.max(0,i.quantity_sent-i.quantity_received)+i.rewash_qty+i.missing_qty+i.damaged_qty,0);
  const inventoryCheck=inventoryChecks.find(c=>c.hotel_id===hotel.id)??null,inventoryVariances=inventoryCheck?inventoryCheckItems.filter(i=>i.check_id===inventoryCheck.id&&(i.physical_qty!==i.expected_qty||i.condition!=="good")).length:0;
  return{id:hotel.id,name:hotel.name,code:hotel.code,onDuty:shift?{employeeName:shift.display_name,startedAt:shift.started_at,shiftId:shift.id,shiftType:shift.shift_type,isLate:!!shift.is_late,lateMinutes:shift.late_minutes||0,lateReason:shift.late_reason||null}:null,openingCash:openingCashSupported?(openingCashEntry?.opening_cash_amount??null):null,cleaningStaff:{total:hotelStaff,marked:hotelAttendance},checklists:{shiftStart:{done:count("shift_start"),total:6},daily:{done:count("daily"),total:8},shiftEnd:{done:count("shift_end"),total:8}},issues:{complaints:openComplaints.length,maintenance:openMaintenance.length,critical:[...openComplaints,...openMaintenance].filter(i=>i.priority==="critical").length},laundry:{openBatches:hotelLaundry.length,unresolved:unresolvedLaundry},inventory:{weekStart,completed:!!inventoryCheck,variances:inventoryVariances}};
 });
 return NextResponse.json({date,hotels:summaries,openingCashSupported,weekStart});
}
