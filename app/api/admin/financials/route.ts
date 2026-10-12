import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

const categories=["Room Revenue","Day Use Revenue","Banquet Revenue","Other Revenue","Laundry","Water","Electricity","Staff Salary","Housekeeping Supplies","Guest Amenities","Repairs & Maintenance","Internet & Telephone","Food & Refreshments","Pest Control","Fuel & Transportation","OTA Commissions","Marketing & Advertising","Rent & Lease","Licences & Subscriptions","Miscellaneous"];
const monthPattern=/^\d{4}-(0[1-9]|1[0-2])$/;
function monthDate(month:string){return month+"-01"}
function validMonth(month:string){return monthPattern.test(month)&&month>="2026-09"}
function validDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+"T00:00:00Z");return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value}
function first<T>(rows:T[]){return rows[0]??null}
type Entry={id:string;hotel_id:string;accounting_month:string;entry_date:string;entry_type:string;category:string;amount:number;status:string;description:string|null};
async function readEntries(hotelIds:string[],month:string){
 const filter=hotelIds.map(encodeURIComponent).join(",");
 const res=await supabaseRequest(`?select=*&hotel_id=in.(${filter})&accounting_month=eq.${monthDate(month)}&order=entry_date.desc,created_at.desc&limit=2000`,{},"hotel_financial_entries");
 if(!res.ok)throw Error("Unable to read financial entries");
 return await res.json() as Entry[];
}
async function readPeriod(hotelId:string,month:string){
 const r=await supabaseRequest(`?select=*&hotel_id=eq.${encodeURIComponent(hotelId)}&month=eq.${monthDate(month)}&limit=1`,{},"hotel_financial_periods");
 if(!r.ok)throw Error("Unable to read accounting period");
 return first(await r.json() as Array<{id:string;status:string}>);
}
async function audit(hotelId:string,entryId:string|null,action:string,actor:string,oldRecord:unknown,newRecord:unknown){
 const r=await supabaseRequest("",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({hotel_id:hotelId,entry_id:entryId,action,actor,old_record:oldRecord,new_record:newRecord})},"hotel_financial_audit");
 return r.ok;
}
export async function GET(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const month=request.nextUrl.searchParams.get("month")||new Date().toISOString().slice(0,7);
 if(!validMonth(month))return NextResponse.json({error:"Choose September 2026 or a later month."},{status:400});
 const hotelsRes=await supabaseRequest("?select=id,name,code&is_active=eq.true&order=name.asc",{},"hotels");
 if(!hotelsRes.ok)return NextResponse.json({error:"Unable to load hotels."},{status:500});
 const allHotels=await hotelsRes.json() as Array<{id:string;name:string;code:string}>;
 const hotels=session.role==="master"?allHotels:allHotels.filter(h=>h.id===session.hotelId);
 const requested=request.nextUrl.searchParams.get("hotelId");
 const allowed=requested?hotels.filter(h=>h.id===requested):hotels;
 if(requested&&!allowed.length)return NextResponse.json({error:"Hotel access denied."},{status:403});
 if(!allowed.length)return NextResponse.json({hotels:[],entries:[],summary:[],month});
 try{
 const allEntries=await readEntries(allowed.map(h=>h.id),month);
 const entries=session.role==="master"?allEntries:allEntries.filter(e=>e.entry_type==="expense");
 const ids=allowed.map(h=>encodeURIComponent(h.id)).join(",");
 const periodsRes=await supabaseRequest(`?select=hotel_id,status,closed_at&hotel_id=in.(${ids})&month=eq.${monthDate(month)}`,{},"hotel_financial_periods");
 const periods=periodsRes.ok?await periodsRes.json() as Array<{hotel_id:string;status:string;closed_at:string|null}>:[];
 const summary=session.role==="master"?allowed.map(h=>{const a=entries.filter(e=>e.hotel_id===h.id&&e.status!=="rejected"),revenue=a.filter(e=>e.entry_type==="revenue").reduce((s,e)=>s+Number(e.amount),0),expenses=a.filter(e=>e.entry_type==="expense").reduce((s,e)=>s+Number(e.amount),0);return{hotelId:h.id,hotelName:h.name,revenue,expenses,profit:revenue-expenses,margin:revenue>0?(revenue-expenses)/revenue*100:null,status:periods.find(p=>p.hotel_id===h.id)?.status||"open"}}):[];
 const staffRes=await supabaseRequest(`?select=id,hotel_id,name,staff_type&hotel_id=in.(${ids})&is_active=eq.true&order=name.asc`,{},"hotel_staff_members");
 const staff=staffRes.ok?await staffRes.json():[];
 const directoryResponse=await supabaseRequest("?select=name,designation&is_active=eq.true&order=name.asc",{},"hotel_employees");
 const employees=directoryResponse.ok?await directoryResponse.json():[];
 return NextResponse.json({hotels:allowed,entries,summary,staff,employees,periods,month,categories});
 }catch{return NextResponse.json({error:"Unable to load financial report."},{status:500})}
}
export async function POST(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await request.json().catch(()=>({})) as Record<string,unknown>;
 const hotelId=hotelScope(session,typeof body.hotelId==="string"?body.hotelId:null);
 if(!hotelId)return NextResponse.json({error:"Select an authorized hotel."},{status:403});
 const month=String(body.month||"");if(!validMonth(month))return NextResponse.json({error:"Month must be September 2026 or later."},{status:400});
 const actor=session.displayName||session.username;
 const action=String(body.action||"create");
 const period=await readPeriod(hotelId,month).catch(()=>null);
 if(action==="close"||action==="reopen"){
  if(session.role!=="master")return NextResponse.json({error:"Only Master Admin can close or reopen months."},{status:403});
  const status=action==="close"?"closed":"open";
  const r=await supabaseRequest("?on_conflict=hotel_id,month",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify({hotel_id:hotelId,month:monthDate(month),status,closed_by:action==="close"?actor:null,closed_at:action==="close"?new Date().toISOString():null})},"hotel_financial_periods");
  if(!r.ok)return NextResponse.json({error:"Unable to update month status."},{status:500});
  await audit(hotelId,null,"period_"+action,actor,period,{month,status});
  return NextResponse.json({success:true});
 }
 if(period?.status==="closed")return NextResponse.json({error:"This month is closed. Request Master Admin to reopen it."},{status:409});
 if(action==="create"||action==="edit"){
 const type=String(body.entryType||"");const category=String(body.category||"").trim(),description=String(body.description||"").trim(),entryDate=String(body.entryDate||"");
 const amount=Number(body.amount);
 if(session.role!=="master"&&type!=="expense")return NextResponse.json({error:"Hotel users can enter expenses only."},{status:403});
 const staffName=category==="Staff Salary"?String(body.staffName||"").trim():"";
 if(category==="Staff Salary"&&(staffName.length<2||staffName.length>120))return NextResponse.json({error:"Enter the staff member name for salary expenses."},{status:400});
 if(!["revenue","expense"].includes(type)||!categories.includes(category)||!Number.isFinite(amount)||amount<=0||amount>100000000||!validDate(entryDate))return NextResponse.json({error:"Enter a valid category, date, amount and type."},{status:400});
 if(!entryDate.startsWith(month))return NextResponse.json({error:"Expense date must belong to the selected accounting month."},{status:400});
 if(category==="Miscellaneous"&&description.length<10)return NextResponse.json({error:"Provide at least 10 characters explaining the Miscellaneous expense."},{status:400});
 if(type==="revenue"&&!category.endsWith("Revenue"))return NextResponse.json({error:"Select a revenue category."},{status:400});
 if(type==="expense"&&category.endsWith("Revenue"))return NextResponse.json({error:"Select an expense category."},{status:400});
 const record={hotel_id:hotelId,staff_name:staffName||null,accounting_month:monthDate(month),entry_date:entryDate,entry_type:type,category,description:description||null,amount:amount.toFixed(2),payment_status:body.paymentStatus==="unpaid"?"unpaid":"paid",payment_method:String(body.paymentMethod||"").slice(0,80)||null,vendor:String(body.vendor||"").slice(0,160)||null,invoice_number:String(body.invoiceNumber||"").slice(0,100)||null,source_type:"manual",status:"approved",entered_by:actor,approved_by:null,approved_at:null};
 if(action==="edit"){
  const id=String(body.entryId||"");
  const existingRes=await supabaseRequest(`?select=*&id=eq.${encodeURIComponent(id)}&hotel_id=eq.${encodeURIComponent(hotelId)}&accounting_month=eq.${monthDate(month)}&limit=1`,{},"hotel_financial_entries");
  if(!existingRes.ok)return NextResponse.json({error:"Unable to verify existing entry."},{status:500});
  const original=first(await existingRes.json() as Array<Entry&{source_type:string;status:string}>);
  if(!original)return NextResponse.json({error:"Expense entry not found."},{status:404});
  if(original.source_type!=="manual"||original.status==="rejected")return NextResponse.json({error:"This entry cannot be edited."},{status:403});
  if(session.role!=="master"&&original.entry_type!=="expense")return NextResponse.json({error:"Hotel users cannot edit revenue."},{status:403});
  if(original.entry_type!==type)return NextResponse.json({error:"Entry type cannot be changed."},{status:400});
  const patch={category,staff_name:staffName||null,entry_date:entryDate,description:description||null,amount:amount.toFixed(2),payment_status:record.payment_status,payment_method:record.payment_method,vendor:record.vendor,invoice_number:record.invoice_number,status:"approved",updated_at:new Date().toISOString()};
  const edited=await supabaseRequest(`?id=eq.${encodeURIComponent(id)}&hotel_id=eq.${encodeURIComponent(hotelId)}&accounting_month=eq.${monthDate(month)}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(patch)},"hotel_financial_entries");
  if(!edited.ok)return NextResponse.json({error:"Unable to update expense."},{status:500});
  const updated=first(await edited.json() as Entry[]);
  if(!updated)return NextResponse.json({error:"Unable to verify expense update."},{status:500});
  await audit(hotelId,id,"edited",actor,original,updated);
  return NextResponse.json({success:true,entry:updated});
 }
 const r=await supabaseRequest("?select=*",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(record)},"hotel_financial_entries");
 if(!r.ok)return NextResponse.json({error:"Unable to save entry."},{status:500});
 const entry=first(await r.json() as Array<{id:string}>);
 if(entry)await audit(hotelId,entry.id,"created",actor,null,record);
 return NextResponse.json({success:true,entry});
 }
 return NextResponse.json({error:"Unsupported action."},{status:400});
}
