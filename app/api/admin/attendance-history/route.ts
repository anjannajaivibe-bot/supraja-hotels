import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate(offsetDays=0){
  const d=new Date(Date.now()+offsetDays*86400000);
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
}

export async function GET(request:NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(session.role!=="master")return NextResponse.json({error:"Master Admin only"},{status:403});

  const from=request.nextUrl.searchParams.get("from")||indiaDate(-6);
  const to=request.nextUrl.searchParams.get("to")||indiaDate();
  const hotelId=request.nextUrl.searchParams.get("hotelId")||"";
  const hotelFilter=hotelId?`&hotel_id=eq.${encodeURIComponent(hotelId)}`:"";
  const startIso=`${from}T00:00:00+05:30`;
  const endIso=`${to}T23:59:59+05:30`;

  const [hotelsRes,attendanceRes,shiftsRes]=await Promise.all([
    supabaseRequest("?select=id,name&is_active=eq.true&order=name.asc",{},"hotels"),
    supabaseRequest(`?select=id,hotel_id,attendance_date,status,marked_at,recorded_by_employee_name,hotel_staff_members(name,staff_type)&attendance_date=gte.${from}&attendance_date=lte.${to}${hotelFilter}&order=attendance_date.desc,marked_at.desc&limit=300`,{},"hotel_staff_attendance"),
    supabaseRequest(`?select=id,hotel_id,display_name,started_at,ended_at,status&started_at=gte.${encodeURIComponent(startIso)}&started_at=lte.${encodeURIComponent(endIso)}${hotelFilter}&order=started_at.desc&limit=200`,{},"hotel_shifts")
  ]);
  if(!hotelsRes.ok||!attendanceRes.ok||!shiftsRes.ok)return NextResponse.json({error:"Unable to load attendance history."},{status:500});
  const hotels=await hotelsRes.json() as Array<{id:string;name:string}>;
  const hotelNames=Object.fromEntries(hotels.map(h=>[h.id,h.name]));
  return NextResponse.json({
    from,to,hotels,
    attendance:(await attendanceRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"})),
    shifts:(await shiftsRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"}))
  });
}
