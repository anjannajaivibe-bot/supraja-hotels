import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

function indiaDate(offsetDays=0){const d=new Date(Date.now()+offsetDays*86400000);return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
function csvCell(value:unknown){const s=String(value??"");return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function formatIndiaDateTime(value?:string|null){return value?new Date(value).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}):""}
function formatTime(value?:string|null){if(!value)return "";const [h,m]=value.split(":");const d=new Date();d.setHours(Number(h),Number(m),0,0);return d.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})}

export async function GET(request:NextRequest){
 const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});if(session.role!=="master")return NextResponse.json({error:"Master Admin only"},{status:403});
 const from=request.nextUrl.searchParams.get("from")||indiaDate(-6),to=request.nextUrl.searchParams.get("to")||indiaDate(),hotelId=request.nextUrl.searchParams.get("hotelId")||"",format=request.nextUrl.searchParams.get("format")||"json";
 const hotelFilter=hotelId?`&hotel_id=eq.${encodeURIComponent(hotelId)}`:"",startIso=`${from}T00:00:00+05:30`,endIso=`${to}T23:59:59+05:30`;
 const [hotelsRes,attendanceRes,shiftsRes]=await Promise.all([
  supabaseRequest("?select=id,name&is_active=eq.true&order=name.asc",{},"hotels"),
  supabaseRequest(`?select=id,hotel_id,attendance_date,status,marked_at,check_in_time,check_out_time,recorded_by_employee_name,hotel_staff_members(name,staff_type)&attendance_date=gte.${from}&attendance_date=lte.${to}${hotelFilter}&order=attendance_date.asc,marked_at.asc&limit=5000`,{},"hotel_staff_attendance"),
  supabaseRequest(`?select=id,hotel_id,display_name,shift_type,scheduled_start_at,scheduled_end_at,started_at,ended_at,status,is_late,late_minutes,late_reason&started_at=gte.${encodeURIComponent(startIso)}&started_at=lte.${encodeURIComponent(endIso)}${hotelFilter}&order=started_at.asc&limit=5000`,{},"hotel_shifts")
 ]);
 if(!hotelsRes.ok||!attendanceRes.ok||!shiftsRes.ok)return NextResponse.json({error:"Unable to load attendance history."},{status:500});
 const hotels=await hotelsRes.json() as Array<{id:string;name:string}>,hotelNames=Object.fromEntries(hotels.map(h=>[h.id,h.name]));
 const attendance=(await attendanceRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"}));
 const shifts=(await shiftsRes.json() as any[]).map(r=>({...r,hotel_name:hotelNames[r.hotel_id]||"Hotel"}));
 if(format==="csv"){
  const rows=[
   ["Record Type","Date","Hotel","Employee / Staff","Staff Type / Shift","Status","Start / Marked Time","End Time","Late Minutes","Late Reason","Recorded By"],
   ...attendance.map(r=>["Cleaning Staff",r.attendance_date,r.hotel_name,r.hotel_staff_members?.name||"",r.hotel_staff_members?.staff_type||"Cleaning",String(r.status||"").replace("_"," "),r.check_in_time?formatTime(r.check_in_time):formatIndiaDateTime(r.marked_at),formatTime(r.check_out_time),"","",r.recorded_by_employee_name||""]),
   ...shifts.map(r=>["Reception Shift",new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date(r.started_at)),r.hotel_name,r.display_name,r.shift_type?`${r.shift_type} shift`:"Shift",r.status,formatIndiaDateTime(r.started_at),formatIndiaDateTime(r.ended_at),r.is_late?r.late_minutes:0,r.late_reason||"",r.display_name])
  ];
  const csv="\uFEFF"+rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),hotelName=hotelId?(hotelNames[hotelId]||"hotel").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase():"all-hotels";
  return new NextResponse(csv,{status:200,headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="supraja-attendance-${hotelName}-${from}-to-${to}.csv"`,"Cache-Control":"no-store"}});
 }
 return NextResponse.json({from,to,hotels,attendance,shifts});
}
