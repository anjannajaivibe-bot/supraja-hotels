import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function bookingCode() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "2-digit", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (type:string) => parts.find(p=>p.type===type)?.value ?? "00";
  return `SH-${value("year")}${value("month")}${value("day")}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function hasActiveShift(username:string) {
  const response = await supabaseRequest(`?select=id&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&limit=1`, {}, "hotel_shifts");
  if (!response.ok) return false;
  return ((await response.json()) as Array<{id:string}>).length > 0;
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  const status = request.nextUrl.searchParams.get("status");
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || 50), 100);
  const hotelFilter = hotelId ? `&hotel_id=eq.${encodeURIComponent(hotelId)}` : "";
  const statusFilter = status ? `&status=eq.${encodeURIComponent(status)}` : "";
  const response = await supabaseRequest(`?select=*&order=created_at.desc&limit=${limit}${hotelFilter}${statusFilter}`, {}, "hotel_bookings");
  if (!response.ok) return NextResponse.json({ error: "Unable to load bookings." }, { status: 500 });
  return NextResponse.json({ bookings: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.role !== "hotel_admin" || !session.hotelId) return NextResponse.json({ error: "Hotel login required." }, { status: 403 });
  if (!(await hasActiveShift(session.username))) return NextResponse.json({ error: "Start your shift before creating a booking." }, { status: 409 });

  const body = await request.json().catch(()=>({})) as {
    source?:string; guestName?:string; phone?:string; roomNo?:string; checkInDate?:string; checkOutDate?:string;
    nights?:number; approvedRate?:number; totalAmount?:number; amountReceived?:number; paymentMode?:string; transactionRef?:string;
  };

  const guestName=body.guestName?.trim();
  const roomNo=body.roomNo?.trim();
  const checkInDate=body.checkInDate?.trim();
  const checkOutDate=body.checkOutDate?.trim();
  const nights=Math.max(1,Math.floor(Number(body.nights)||1));
  const approvedRate=Number(body.approvedRate)||0;
  const totalAmount=Number(body.totalAmount)||approvedRate*nights;
  const amountReceived=Number(body.amountReceived)||0;
  const allowedSources=["walk_in","phone","whatsapp","website","ota","corporate","referral","management"];
  const allowedModes=["cash","upi","card","bank_transfer","mixed"];
  const source=allowedSources.includes(body.source??"")?body.source!:"walk_in";

  if(!guestName || guestName.length>100) return NextResponse.json({error:"Enter guest name."},{status:400});
  if(!roomNo || roomNo.length>30) return NextResponse.json({error:"Enter room number."},{status:400});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(checkInDate??"") || !/^\d{4}-\d{2}-\d{2}$/.test(checkOutDate??"")) return NextResponse.json({error:"Enter valid check-in and check-out dates."},{status:400});
  if(checkOutDate!<=checkInDate!) return NextResponse.json({error:"Check-out date must be after check-in date."},{status:400});
  if(approvedRate<0 || totalAmount<0 || amountReceived<0 || amountReceived>totalAmount) return NextResponse.json({error:"Check rate, total and received amount."},{status:400});
  if(amountReceived>0 && !allowedModes.includes(body.paymentMode??"")) return NextResponse.json({error:"Select payment mode."},{status:400});

  const code=bookingCode();
  const bookingRes=await supabaseRequest("",{
    method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({
      booking_code:code,hotel_id:session.hotelId,source,guest_name:guestName,phone:body.phone?.trim()||null,room_no:roomNo,
      check_in_date:checkInDate,check_out_date:checkOutDate,nights,approved_rate:approvedRate,total_amount:totalAmount,status:"checked_in",
      created_by:session.username,checked_in_at:new Date().toISOString(),
    })
  },"hotel_bookings");
  if(!bookingRes.ok) return NextResponse.json({error:"Unable to create booking."},{status:500});
  const booking=(await bookingRes.json() as Array<{id:string;booking_code:string}>)[0];

  if(amountReceived>0){
    const paymentRes=await supabaseRequest("",{
      method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({
        hotel_id:session.hotelId,booking_id:booking.id,amount:amountReceived,payment_type:"payment",payment_mode:body.paymentMode,
        transaction_ref:body.transactionRef?.trim()||null,recorded_by:session.username,
      })
    },"hotel_payments");
    if(!paymentRes.ok){
      await supabaseRequest(`?id=eq.${booking.id}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({status:"cancelled",updated_at:new Date().toISOString()})},"hotel_bookings");
      return NextResponse.json({error:"Payment could not be recorded. Booking was cancelled to protect reconciliation."},{status:500});
    }
  }

  await writeAuditLog(session,"booking_created","hotel_booking",booking.id,session.hotelId,{bookingCode:code,source,roomNo,totalAmount,amountReceived});
  return NextResponse.json({success:true,bookingId:booking.id,bookingCode:code});
}

export async function PATCH(request: NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});
  if(!(await hasActiveShift(session.username)))return NextResponse.json({error:"Start your shift before updating a booking."},{status:409});
  const body=await request.json().catch(()=>({})) as {id?:string;action?:"checkout"|"cancel"};
  if(!body.id||!body.action)return NextResponse.json({error:"Booking and action are required."},{status:400});
  const existingRes=await supabaseRequest(`?select=id,hotel_id,status,booking_code&id=eq.${encodeURIComponent(body.id)}&hotel_id=eq.${encodeURIComponent(session.hotelId)}&limit=1`,{},"hotel_bookings");
  if(!existingRes.ok)return NextResponse.json({error:"Unable to verify booking."},{status:500});
  const existing=(await existingRes.json() as Array<{id:string;hotel_id:string;status:string;booking_code:string}>)[0];
  if(!existing)return NextResponse.json({error:"Booking not found."},{status:404});
  if(body.action==="cancel" && existing.status==="checked_in")return NextResponse.json({error:"Checked-in bookings cannot be cancelled. Complete checkout or escalate to Master Admin."},{status:409});
  const status=body.action==="checkout"?"checked_out":"cancelled";
  const update:Record<string,unknown>={status,updated_at:new Date().toISOString()};
  if(body.action==="checkout")update.checked_out_at=new Date().toISOString();
  const res=await supabaseRequest(`?id=eq.${existing.id}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify(update)},"hotel_bookings");
  if(!res.ok)return NextResponse.json({error:"Unable to update booking."},{status:500});
  await writeAuditLog(session,body.action==="checkout"?"booking_checked_out":"booking_cancelled","hotel_booking",existing.id,session.hotelId,{bookingCode:existing.booking_code});
  return NextResponse.json({success:true});
}
