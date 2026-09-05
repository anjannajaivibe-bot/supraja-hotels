import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

async function hasActiveShift(username:string) {
  const response = await supabaseRequest(`?select=id&admin_username=eq.${encodeURIComponent(username)}&status=eq.active&limit=1`, {}, "hotel_shifts");
  if (!response.ok) return false;
  return ((await response.json()) as Array<{id:string}>).length > 0;
}

export async function GET(request: NextRequest) {
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  const hotelId=hotelScope(session,request.nextUrl.searchParams.get("hotelId"));
  const bookingId=request.nextUrl.searchParams.get("bookingId");
  const hotelFilter=hotelId?`&hotel_id=eq.${encodeURIComponent(hotelId)}`:"";
  const bookingFilter=bookingId?`&booking_id=eq.${encodeURIComponent(bookingId)}`:"";
  const response=await supabaseRequest(`?select=*&order=created_at.desc&limit=200${hotelFilter}${bookingFilter}`,{},"hotel_payments");
  if(!response.ok)return NextResponse.json({error:"Unable to load payments."},{status:500});
  return NextResponse.json({payments:await response.json()});
}

export async function POST(request:NextRequest){
  const session=getAdminSession(request);
  if(!session)return NextResponse.json({error:"Unauthorized."},{status:401});
  if(session.role!=="hotel_admin"||!session.hotelId)return NextResponse.json({error:"Hotel login required."},{status:403});
  if(!(await hasActiveShift(session.username)))return NextResponse.json({error:"Start your shift before recording payment."},{status:409});

  const body=await request.json().catch(()=>({})) as {bookingId?:string;amount?:number;paymentMode?:string;transactionRef?:string};
  const amount=Number(body.amount)||0;
  const allowedModes=["cash","upi","card","bank_transfer","mixed"];
  if(!body.bookingId||amount<=0)return NextResponse.json({error:"Booking and positive payment amount are required."},{status:400});
  if(!allowedModes.includes(body.paymentMode??""))return NextResponse.json({error:"Select a valid payment mode."},{status:400});

  const bookingRes=await supabaseRequest(`?select=id,hotel_id,total_amount,status,booking_code&id=eq.${encodeURIComponent(body.bookingId)}&hotel_id=eq.${encodeURIComponent(session.hotelId)}&limit=1`,{},"hotel_bookings");
  if(!bookingRes.ok)return NextResponse.json({error:"Unable to verify booking."},{status:500});
  const booking=(await bookingRes.json() as Array<{id:string;hotel_id:string;total_amount:number;status:string;booking_code:string}>)[0];
  if(!booking)return NextResponse.json({error:"Booking not found."},{status:404});
  if(booking.status==="cancelled")return NextResponse.json({error:"Cannot record payment on a cancelled booking."},{status:409});

  const existingPaymentsRes=await supabaseRequest(`?select=amount,payment_type&booking_id=eq.${encodeURIComponent(booking.id)}`,{},"hotel_payments");
  if(!existingPaymentsRes.ok)return NextResponse.json({error:"Unable to verify booking balance."},{status:500});
  const existing=await existingPaymentsRes.json() as Array<{amount:number;payment_type:string}>;
  const paid=existing.reduce((sum,p)=>sum+(p.payment_type==="refund"?-Number(p.amount):Number(p.amount)),0);
  if(paid+amount>Number(booking.total_amount)+0.01)return NextResponse.json({error:`Payment exceeds outstanding balance of ₹${Math.max(0,Number(booking.total_amount)-paid).toFixed(2)}.`},{status:409});

  const response=await supabaseRequest("",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({
    hotel_id:session.hotelId,booking_id:booking.id,amount,payment_type:"payment",payment_mode:body.paymentMode,
    transaction_ref:body.transactionRef?.trim()||null,recorded_by:session.username,
  })},"hotel_payments");
  if(!response.ok)return NextResponse.json({error:"Unable to record payment."},{status:500});
  const payment=(await response.json() as Array<{id:string}>)[0];
  await writeAuditLog(session,"payment_recorded","hotel_payment",payment?.id??null,session.hotelId,{bookingCode:booking.booking_code,amount,paymentMode:body.paymentMode});
  return NextResponse.json({success:true});
}
