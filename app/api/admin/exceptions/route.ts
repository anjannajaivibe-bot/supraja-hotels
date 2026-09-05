import { NextResponse,type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}

type ExceptionItem={type:string;severity:"warning"|"critical";title:string;detail:string;hotelId:string;roomNo?:string;bookingCode?:string};

export async function GET(request:NextRequest){
  const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  const requested=request.nextUrl.searchParams.get("hotelId");
  const scope=hotelScope(session,requested);
  const hotelFilter=scope?`&hotel_id=eq.${encodeURIComponent(scope)}`:"";
  const [hotelsRes,roomsRes,bookingsRes,paymentsRes,recsRes,complaintsRes,maintRes,shiftsRes]=await Promise.all([
    supabaseRequest(`?select=id,name,code&is_active=eq.true${scope?`&id=eq.${encodeURIComponent(scope)}`:""}`,{},"hotels"),
    supabaseRequest(`?select=id,hotel_id,room_no,status&is_active=eq.true${hotelFilter}`,{},"hotel_rooms"),
    supabaseRequest(`?select=id,hotel_id,booking_code,guest_name,room_no,check_out_date,total_amount,status&status=eq.checked_in${hotelFilter}`,{},"hotel_bookings"),
    supabaseRequest(`?select=hotel_id,booking_id,amount,payment_type${hotelFilter}`,{},"hotel_payments"),
    supabaseRequest(`?select=id,hotel_id,reconciliation_date,cash_variance,status${hotelFilter}&order=reconciliation_date.desc`,{},"hotel_daily_reconciliations"),
    supabaseRequest(`?select=id,hotel_id,room_no,priority,status,complaint${hotelFilter}&status=neq.resolved`,{},"hotel_complaints"),
    supabaseRequest(`?select=id,hotel_id,room_no,priority,status,issue${hotelFilter}&status=neq.resolved`,{},"hotel_maintenance_tickets"),
    supabaseRequest(`?select=id,hotel_id,status,display_name&status=eq.active${hotelFilter}`,{},"hotel_shifts")
  ]);
  if([hotelsRes,roomsRes,bookingsRes,paymentsRes,recsRes,complaintsRes,maintRes,shiftsRes].some(r=>!r.ok))return NextResponse.json({error:"Unable to calculate exceptions."},{status:500});
  const hotels=await hotelsRes.json() as {id:string;name:string}[];const rooms=await roomsRes.json() as {hotel_id:string;room_no:string;status:string}[];const bookings=await bookingsRes.json() as {id:string;hotel_id:string;booking_code:string;guest_name:string;room_no:string;check_out_date:string;total_amount:number}[];const payments=await paymentsRes.json() as {hotel_id:string;booking_id:string;amount:number;payment_type:string}[];const recs=await recsRes.json() as {hotel_id:string;reconciliation_date:string;cash_variance:number;status:string}[];const complaints=await complaintsRes.json() as {hotel_id:string;room_no:string|null;priority:string;complaint:string}[];const maint=await maintRes.json() as {hotel_id:string;room_no:string|null;priority:string;issue:string}[];const shifts=await shiftsRes.json() as {hotel_id:string}[];
  const name=new Map(hotels.map(h=>[h.id,h.name]));const list:ExceptionItem[]=[];const today=indiaDate();const roomKey=(h:string,r:string)=>`${h}|${r.toLowerCase()}`;const checked=new Map(bookings.map(b=>[roomKey(b.hotel_id,b.room_no),b]));const roomMap=new Map(rooms.map(r=>[roomKey(r.hotel_id,r.room_no),r]));const paid=new Map<string,number>();for(const p of payments)paid.set(p.booking_id,(paid.get(p.booking_id)||0)+(p.payment_type==="refund"?-Number(p.amount):Number(p.amount)));
  for(const b of bookings){const rm=roomMap.get(roomKey(b.hotel_id,b.room_no));if(!rm)list.push({type:"room_missing",severity:"warning",title:"Checked-in room missing from Room Master",detail:`${b.booking_code} · ${b.guest_name} · Room ${b.room_no}`,hotelId:b.hotel_id,roomNo:b.room_no,bookingCode:b.booking_code});else if(rm.status!=="occupied")list.push({type:"occupancy_mismatch",severity:"critical",title:"Checked-in booking but room not marked occupied",detail:`${b.booking_code} · Room ${b.room_no} is ${rm.status}`,hotelId:b.hotel_id,roomNo:b.room_no,bookingCode:b.booking_code});if(b.check_out_date<today)list.push({type:"overdue_checkout",severity:"critical",title:"Checkout overdue",detail:`${b.booking_code} · ${b.guest_name} · Room ${b.room_no} · Due ${b.check_out_date}`,hotelId:b.hotel_id,roomNo:b.room_no,bookingCode:b.booking_code});const bal=Math.max(0,Number(b.total_amount)-(paid.get(b.id)||0));if(bal>0)list.push({type:"unpaid_balance",severity:"warning",title:"Outstanding guest balance",detail:`${b.booking_code} · Room ${b.room_no} · ₹${bal.toLocaleString("en-IN")}`,hotelId:b.hotel_id,roomNo:b.room_no,bookingCode:b.booking_code});}
  for(const r of rooms){if(r.status==="occupied"&&!checked.has(roomKey(r.hotel_id,r.room_no)))list.push({type:"occupied_without_booking",severity:"critical",title:"Occupied room without active Booking ID",detail:`Room ${r.room_no} is marked occupied with no checked-in booking`,hotelId:r.hotel_id,roomNo:r.room_no});}
  for(const h of hotels){if(!shifts.some(s=>s.hotel_id===h.id))list.push({type:"no_active_shift",severity:"warning",title:"No active hotel shift",detail:"No Manager/Receptionist is currently clocked in",hotelId:h.id});const latest=recs.find(r=>r.hotel_id===h.id&&r.reconciliation_date===today);if(latest&&Math.abs(Number(latest.cash_variance))>0.01)list.push({type:"cash_variance",severity:"critical",title:"Cash variance pending",detail:`Today's variance ₹${Number(latest.cash_variance).toLocaleString("en-IN")}`,hotelId:h.id});}
  for(const c of complaints.filter(c=>c.priority==="critical"))list.push({type:"critical_complaint",severity:"critical",title:"Critical guest complaint open",detail:`${c.room_no?`Room ${c.room_no} · `:""}${c.complaint}`,hotelId:c.hotel_id,roomNo:c.room_no||undefined});
  for(const m of maint.filter(m=>m.priority==="critical"))list.push({type:"critical_maintenance",severity:"critical",title:"Critical maintenance issue open",detail:`${m.room_no?`Room ${m.room_no} · `:""}${m.issue}`,hotelId:m.hotel_id,roomNo:m.room_no||undefined});
  const byHotel=hotels.map(h=>({hotelId:h.id,hotelName:h.name,critical:list.filter(x=>x.hotelId===h.id&&x.severity==="critical").length,warnings:list.filter(x=>x.hotelId===h.id&&x.severity==="warning").length,total:list.filter(x=>x.hotelId===h.id).length}));
  return NextResponse.json({exceptions:list.map(x=>({...x,hotelName:name.get(x.hotelId)||"Hotel"})),summary:byHotel});
}
