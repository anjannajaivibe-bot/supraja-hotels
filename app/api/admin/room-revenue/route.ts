import {NextResponse,type NextRequest} from "next/server";
import {getAdminSession} from "@/lib/admin-auth";
import {hotelScope} from "@/lib/hotel-ops";
import {supabaseRequest} from "@/lib/supabase-rest";
const iso=(d:string)=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+"T00:00:00Z"))&&new Date(d+"T00:00:00Z").toISOString().slice(0,10)===d;
export async function GET(req:NextRequest){
 const s=getAdminSession(req);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});
 const hotelId=hotelScope(s,req.nextUrl.searchParams.get("hotelId"));if(!hotelId)return NextResponse.json({error:"Invalid hotel"},{status:403});
 const month=req.nextUrl.searchParams.get("month")||new Date().toISOString().slice(0,7);
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||month<"2026-09")return NextResponse.json({error:"Invalid month"},{status:400});
 const r=await supabaseRequest(`?select=id,entry_date,amount,description,source_id,invoice_number,created_at&hotel_id=eq.${encodeURIComponent(hotelId)}&source_type=eq.room_board&accounting_month=eq.${month}-01&order=entry_date.desc&limit=250`,{},"hotel_financial_entries");
 if(!r.ok)return NextResponse.json({error:"Unable to load room revenue"},{status:500});
 const p=await supabaseRequest(`?select=status&hotel_id=eq.${encodeURIComponent(hotelId)}&month=eq.${month}-01&limit=1`,{},"hotel_financial_periods");
 const periods=p.ok?await p.json() as Array<{status:string}>:[];
 return NextResponse.json({records:await r.json(),closed:periods[0]?.status==="closed"});
}
export async function POST(req:NextRequest){
 const s=getAdminSession(req);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});
 const b=await req.json().catch(()=>({})) as Record<string,unknown>;
 const hotelId=hotelScope(s,typeof b.hotelId==="string"?b.hotelId:null);if(!hotelId)return NextResponse.json({error:"Hotel access denied"},{status:403});
 const date=String(b.date||""),roomId=String(b.roomId||""),amount=Number(b.amount),reference=String(b.reference||"").trim();
 if(!iso(date)||date<"2026-09-01"||!Number.isFinite(amount)||amount<=0||amount>10000000||!roomId||reference.length>100)return NextResponse.json({error:"Enter a valid date, room, and actual collected/earned fare"},{status:400});
 const month=date.slice(0,7);
 const [r,p]=await Promise.all([supabaseRequest(`?select=id,room_no&hotel_id=eq.${encodeURIComponent(hotelId)}&id=eq.${encodeURIComponent(roomId)}&is_active=eq.true&limit=1`,{},"hotel_rooms"),supabaseRequest(`?select=status&hotel_id=eq.${encodeURIComponent(hotelId)}&month=eq.${month}-01&limit=1`,{},"hotel_financial_periods")]);
 if(!r.ok||!p.ok)return NextResponse.json({error:"Unable to validate room/period"},{status:500});
 const room=(await r.json() as Array<{id:string;room_no:string}>)[0],period=(await p.json() as Array<{status:string}>)[0];
 if(!room)return NextResponse.json({error:"Room does not belong to this hotel"},{status:403});
 if(period?.status==="closed")return NextResponse.json({error:"This accounting month is closed"},{status:409});
 const actor=s.displayName||s.username;
 const record={hotel_id:hotelId,accounting_month:month+"-01",entry_date:date,entry_type:"revenue",category:"Room Revenue",description:"Room "+room.room_no+(reference?" | "+reference:""),amount:amount.toFixed(2),payment_status:"paid",invoice_number:reference||null,source_type:"room_board",source_id:crypto.randomUUID(),status:"approved",entered_by:actor};
 const saved=await supabaseRequest("?select=id",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(record)},"hotel_financial_entries");
 if(!saved.ok)return NextResponse.json({error:"Unable to save room revenue"},{status:500});
 const entry=(await saved.json() as Array<{id:string}>)[0];
 await supabaseRequest("",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({entry_id:entry.id,hotel_id:hotelId,actor,action:"room_revenue_created",new_record:record})},"hotel_financial_audit");
 return NextResponse.json({success:true});
}