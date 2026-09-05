import { NextResponse,type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope,writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

const allowedStatus=["available","occupied","dirty","maintenance","blocked"];

export async function GET(request:NextRequest){
  const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  const hotelId=hotelScope(session,request.nextUrl.searchParams.get("hotelId"));if(!hotelId)return NextResponse.json({error:"Hotel required."},{status:400});
  const [roomsRes,bookingsRes]=await Promise.all([
    supabaseRequest(`?select=*&hotel_id=eq.${encodeURIComponent(hotelId)}&is_active=eq.true&order=room_no.asc`,{},"hotel_rooms"),
    supabaseRequest(`?select=id,booking_code,guest_name,room_no,check_out_date,total_amount&hotel_id=eq.${encodeURIComponent(hotelId)}&status=eq.checked_in&order=created_at.desc`,{},"hotel_bookings")
  ]);
  if(!roomsRes.ok||!bookingsRes.ok)return NextResponse.json({error:"Unable to load room board."},{status:500});
  return NextResponse.json({rooms:await roomsRes.json(),bookings:await bookingsRes.json()});
}

export async function POST(request:NextRequest){
  const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});
  const body=await request.json().catch(()=>({})) as {roomNo?:string;roomType?:string;notes?:string};
  const roomNo=body.roomNo?.trim();if(!roomNo||roomNo.length>30)return NextResponse.json({error:"Enter a valid room number."},{status:400});
  const res=await supabaseRequest("",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({hotel_id:session.hotelId,room_no:roomNo,room_type:body.roomType?.trim()||null,notes:body.notes?.trim()||null,updated_by:session.username})},"hotel_rooms");
  if(!res.ok){const t=await res.text();return NextResponse.json({error:t.includes("hotel_rooms_hotel_id_room_no_key")?"Room already exists.":"Unable to add room."},{status:t.includes("hotel_rooms_hotel_id_room_no_key")?409:500});}
  const row=(await res.json())[0];await writeAuditLog(session,"room_created","hotel_room",row?.id??null,session.hotelId,{roomNo});return NextResponse.json({success:true});
}

export async function PATCH(request:NextRequest){
  const session=getAdminSession(request);if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});
  const body=await request.json().catch(()=>({})) as {id?:string;status?:string;notes?:string};
  if(!body.id||!allowedStatus.includes(body.status||""))return NextResponse.json({error:"Invalid room update."},{status:400});
  if(body.status==="occupied"){
    const rr=await supabaseRequest(`?select=room_no&id=eq.${encodeURIComponent(body.id)}&hotel_id=eq.${encodeURIComponent(session.hotelId)}&limit=1`,{},"hotel_rooms");
    const room=rr.ok?(await rr.json())[0]:null;if(!room)return NextResponse.json({error:"Room not found."},{status:404});
    const br=await supabaseRequest(`?select=id&hotel_id=eq.${encodeURIComponent(session.hotelId)}&room_no=eq.${encodeURIComponent(room.room_no)}&status=eq.checked_in&limit=1`,{},"hotel_bookings");
    if(!br.ok||!(await br.json()).length)return NextResponse.json({error:"A room can be marked occupied only when a checked-in Booking ID exists."},{status:409});
  }
  const res=await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}&hotel_id=eq.${encodeURIComponent(session.hotelId)}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({status:body.status,notes:body.notes?.trim()||null,updated_by:session.username,updated_at:new Date().toISOString()})},"hotel_rooms");
  if(!res.ok)return NextResponse.json({error:"Unable to update room."},{status:500});
  const row=(await res.json())[0];await writeAuditLog(session,"room_status_changed","hotel_room",body.id,session.hotelId,{roomNo:row?.room_no,status:body.status});return NextResponse.json({success:true});
}
