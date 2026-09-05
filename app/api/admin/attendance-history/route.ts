import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate(offsetDays=0){
  const d=new Date(Date.now()+offsetDays*86400000);
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
}
function csvCell(value:unknown){const s=String(value??"");return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;}
function formatIndiaDateTime(value?:string|null){if(!value)return "";return new Date(value).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"});}

export async function GET(request:NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(session.role!=="master")return NextResponse.json({error:"Master Admin only"},{status:403});

  const from=request.nextUrl.searchParams.get("from")||indiaDate(-6);
  const to=request.nextUrl.searchParams.get("to")||indiaDate();
  const hotelId=request.nextUrl.searchParams.get("hotelId")||"";
  const format=request.nextUrl.searchParams.get("format")||"json";
  const hotelFilter=hotelId?`&hotel_id=eq.${encodeURIComponent(hotelId)}`:"";
  const startIso=`${from}T00:00:00+05:30`;
  const endIso=`${to}T23:59:59+05:30`;

  const [hotelsRes,attendanceRes,shiftsRes]=await Promise.all([
    supabaseRequest("?select=id,name&is_active=eq.true&order=name.asc",{},"hotels"),
    supabaseRequest(`?select=id,hotel_id,attendance_date,status,marked_at,recorded_by_employee_name,hotel_staff_members(name,staff_type)&attendance_date=gte.${from}&attendance_date=lte.${to}${hotelFilter}&order=attendance_date.asc,marked_at.asc&limit=5000`,{},"hotel_staff_attendance"),
    supabaseRequest(`?select=id,hotel_id,display_name,started_at,ended_at,status&started_at=gte.${encodeURIComponent(startIso)}&started_at=lte.${encodeURIComponent(endIso)}${hotelFilter}&order=started_at.asc&limit=5000`,{},"hotel_shifts")
  ]);
  if(!hotelsRes.ok||!attendanceRes.ok||!shiftsRes.ok)return NextResponse.json({error:"Unable to load attendance history."},{status:500});
  const hotels=await hotelsRes.json() as Array<{id:string;name:string}>;
  const hotelNames=Object.fromEntries(hotels.map(h=>[h.id,h.name]));
  const attendance=(await attendanceRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"}));
  const shifts=(await shiftsRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"}));

  if(format==="csv"){
    const rows=[
      ["Date","Hotel","Staff Name","Staff Type","Status","Marked At","Recorded By"],
      ...attendance.map(r=>[
        r.attendance_date,
        r.hotel_name,
        r.hotel_staff_members?.name||"",
        r.hotel_staff_members?.staff_type||"",
        String(r.status||"").replace("_"," "),
        formatIndiaDateTime(r.marked_at),
        r.recorded_by_employee_name||""
      ])
    ];
    const csv="\uFEFF"+rows.map(row=>row.map(csvCell).join(",")).join("\r\n");
    const hotelName=hotelId?(hotelNames[hotelId]||"hotel").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase():"all-hotels";
    return new NextResponse(csv,{status:200,headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="supraja-attendance-${hotelName}-${from}-to-${to}.csv"`,"Cache-Control":"no-store"}});
  }

  return NextResponse.json({from,to,hotels,attendance,shifts});
}
