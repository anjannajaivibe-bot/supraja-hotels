import { NextResponse,type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

type ExceptionItem={type:string;severity:"warning"|"critical";title:string;detail:string;hotelId:string;roomNo?:string};

export async function GET(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
 const scope=hotelScope(session,request.nextUrl.searchParams.get("hotelId"));const hotelFilter=scope?`&hotel_id=eq.${encodeURIComponent(scope)}`:"";
 const[hotelsRes,roomsRes,complaintsRes,maintRes,shiftsRes]=await Promise.all([
  supabaseRequest(`?select=id,name&is_active=eq.true${scope?`&id=eq.${encodeURIComponent(scope)}`:""}`,{},"hotels"),
  supabaseRequest(`?select=hotel_id,room_no,status&is_active=eq.true${hotelFilter}`,{},"hotel_rooms"),
  supabaseRequest(`?select=hotel_id,room_no,priority,complaint&status=neq.resolved${hotelFilter}`,{},"hotel_complaints"),
  supabaseRequest(`?select=hotel_id,room_no,priority,issue&status=neq.resolved${hotelFilter}`,{},"hotel_maintenance_tickets"),
  supabaseRequest(`?select=hotel_id,display_name&status=eq.active${hotelFilter}`,{},"hotel_shifts")
 ]);
 if([hotelsRes,roomsRes,complaintsRes,maintRes,shiftsRes].some(r=>!r.ok))return NextResponse.json({error:"Unable to calculate exceptions."},{status:500});
 const hotels=await hotelsRes.json() as {id:string;name:string}[],rooms=await roomsRes.json() as {hotel_id:string;room_no:string;status:string}[],complaints=await complaintsRes.json() as {hotel_id:string;room_no:string|null;priority:string;complaint:string}[],maint=await maintRes.json() as {hotel_id:string;room_no:string|null;priority:string;issue:string}[],shifts=await shiftsRes.json() as {hotel_id:string}[];
 const name=new Map(hotels.map(h=>[h.id,h.name]));const list:ExceptionItem[]=[];
 for(const h of hotels)if(!shifts.some(s=>s.hotel_id===h.id))list.push({type:"no_active_shift",severity:"warning",title:"No active hotel shift",detail:"No Manager/Receptionist is currently on duty",hotelId:h.id});
 for(const r of rooms.filter(r=>r.status==="maintenance"||r.status==="blocked"))list.push({type:r.status==="maintenance"?"room_maintenance":"room_blocked",severity:r.status==="maintenance"?"warning":"warning",title:r.status==="maintenance"?"Room under maintenance":"Room blocked",detail:`Room ${r.room_no} requires attention`,hotelId:r.hotel_id,roomNo:r.room_no});
 for(const c of complaints.filter(c=>c.priority==="critical"))list.push({type:"critical_complaint",severity:"critical",title:"Critical guest complaint open",detail:`${c.room_no?`Room ${c.room_no} · `:""}${c.complaint}`,hotelId:c.hotel_id,roomNo:c.room_no||undefined});
 for(const m of maint.filter(m=>m.priority==="critical"))list.push({type:"critical_maintenance",severity:"critical",title:"Critical maintenance issue open",detail:`${m.room_no?`Room ${m.room_no} · `:""}${m.issue}`,hotelId:m.hotel_id,roomNo:m.room_no||undefined});
 const summary=hotels.map(h=>({hotelId:h.id,hotelName:h.name,critical:list.filter(x=>x.hotelId===h.id&&x.severity==="critical").length,warnings:list.filter(x=>x.hotelId===h.id&&x.severity==="warning").length,total:list.filter(x=>x.hotelId===h.id).length}));
 return NextResponse.json({exceptions:list.map(x=>({...x,hotelName:name.get(x.hotelId)||"Hotel"})),summary});
}
