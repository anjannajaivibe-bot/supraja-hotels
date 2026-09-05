"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, BedDouble, CalendarDays, CheckCircle2, IndianRupee, Plus, RefreshCw } from "lucide-react";

type Session={username:string;displayName:string;role:"master"|"hotel_admin";hotelId:string|null;hotelName:string|null};
type Hotel={id:string;name:string};
type Booking={id:string;booking_code:string;hotel_id:string;source:string;guest_name:string;phone:string|null;room_no:string;check_in_date:string;check_out_date:string;nights:number;approved_rate:number;total_amount:number;status:string;created_at:string};
type Payment={id:string;booking_id:string;amount:number;payment_type:string;payment_mode:string;transaction_ref:string|null;created_at:string};

const card="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const input="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const btn="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

function localDate(offsetDays=0){const d=new Date();d.setDate(d.getDate()+offsetDays);const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`;}

export default function TodayPage(){
  const [session,setSession]=useState<Session|null>(null);
  const [hotels,setHotels]=useState<Hotel[]>([]);
  const [selectedHotel,setSelectedHotel]=useState("");
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [payments,setPayments]=useState<Payment[]>([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [newBooking,setNewBooking]=useState({guestName:"",phone:"",roomNo:"",source:"walk_in",checkInDate:localDate(),checkOutDate:localDate(1),nights:1,approvedRate:"",totalAmount:"",amountReceived:"",paymentMode:"cash",transactionRef:""});
  const [paymentForm,setPaymentForm]=useState<{bookingId:string;amount:string;paymentMode:string;transactionRef:string}|null>(null);

  const load=useCallback(async()=>{
    const sessionRes=await fetch("/api/admin/session",{cache:"no-store"});
    if(sessionRes.status===401){window.location.href="/admin/login";return;}
    const sd=await sessionRes.json() as {session:Session};setSession(sd.session);
    const hotelRes=await fetch("/api/admin/hotels",{cache:"no-store"});const hd=await hotelRes.json() as {hotels?:Hotel[]};const available=hd.hotels??[];setHotels(available);
    const hotelId=sd.session.role==="hotel_admin"?sd.session.hotelId??"":selectedHotel||available[0]?.id||"";if(!selectedHotel&&hotelId)setSelectedHotel(hotelId);
    const q=hotelId?`?hotelId=${encodeURIComponent(hotelId)}&limit=100`:"?limit=100";
    const [br,pr]=await Promise.all([fetch(`/api/admin/bookings${q}`,{cache:"no-store"}),fetch(`/api/admin/payments${q}`,{cache:"no-store"})]);
    const bd=await br.json() as {bookings?:Booking[];error?:string};const pd=await pr.json() as {payments?:Payment[];error?:string};
    setBookings(bd.bookings??[]);setPayments(pd.payments??[]);if(!br.ok||!pr.ok)setMessage(bd.error??pd.error??"Unable to load today's controls.");
  },[selectedHotel]);

  useEffect(()=>{void load();},[load]);

  const paidByBooking=useMemo(()=>{const map=new Map<string,number>();for(const p of payments){map.set(p.booking_id,(map.get(p.booking_id)??0)+(p.payment_type==="refund"?-Number(p.amount):Number(p.amount)));}return map;},[payments]);
  const active=useMemo(()=>bookings.filter(b=>b.status==="checked_in"),[bookings]);
  const todayPayments=useMemo(()=>payments.filter(p=>new Date(p.created_at).toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})===new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})),[payments]);
  const todayCollections=useMemo(()=>todayPayments.reduce((s,p)=>s+(p.payment_type==="refund"?-Number(p.amount):Number(p.amount)),0),[todayPayments]);
  const todayCash=useMemo(()=>todayPayments.filter(p=>p.payment_mode==="cash").reduce((s,p)=>s+Number(p.amount),0),[todayPayments]);
  const outstanding=useMemo(()=>active.reduce((s,b)=>s+Math.max(0,Number(b.total_amount)-(paidByBooking.get(b.id)??0)),0),[active,paidByBooking]);

  async function createBooking(e:FormEvent){
    e.preventDefault();setBusy(true);setMessage("");
    const payload={...newBooking,nights:Number(newBooking.nights),approvedRate:Number(newBooking.approvedRate),totalAmount:Number(newBooking.totalAmount||Number(newBooking.approvedRate)*Number(newBooking.nights)),amountReceived:Number(newBooking.amountReceived)};
    const res=await fetch("/api/admin/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await res.json() as {error?:string;bookingCode?:string};
    if(res.ok){setMessage(`Booking ${data.bookingCode} created and checked in.`);setNewBooking(v=>({...v,guestName:"",phone:"",roomNo:"",approvedRate:"",totalAmount:"",amountReceived:"",transactionRef:""}));await load();}else setMessage(data.error??"Unable to create booking.");setBusy(false);
  }

  async function recordPayment(e:FormEvent){e.preventDefault();if(!paymentForm)return;setBusy(true);setMessage("");const res=await fetch("/api/admin/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...paymentForm,amount:Number(paymentForm.amount)})});const data=await res.json() as {error?:string};setMessage(res.ok?"Payment recorded.":data.error??"Unable to record payment.");if(res.ok){setPaymentForm(null);await load();}setBusy(false);}
  async function checkout(id:string){if(!window.confirm("Complete checkout for this booking?"))return;setBusy(true);const res=await fetch("/api/admin/bookings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,action:"checkout"})});const data=await res.json() as {error?:string};setMessage(res.ok?"Guest checked out successfully.":data.error??"Unable to checkout.");if(res.ok)await load();setBusy(false);}

  if(!session)return <main className="min-h-screen bg-slate-50 p-8 text-slate-600">Loading today dashboard...</main>;

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Supraja Hotels</p><h1 className="mt-1 text-2xl font-bold">Today</h1><p className="mt-1 text-sm text-slate-600">Bookings, occupied rooms, collections and pending balances in one simple view.</p></div><div className="flex flex-wrap gap-2"><Link href="/admin/operations" className={`${btn} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}>Attendance & Shifts</Link>{session.role==="master"&&<Link href="/admin/users" className={`${btn} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}>Hotel Users</Link>}<button onClick={()=>void load()} className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}><RefreshCw size={16}/>Refresh</button></div></div></header>
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {session.role==="master"&&<section className={card}><label className="block max-w-sm"><span className="mb-2 block text-sm font-semibold">Hotel to monitor</span><select className={input} value={selectedHotel} onChange={e=>setSelectedHotel(e.target.value)}>{hotels.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></label></section>}
      {message&&<div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">{message}</div>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={card}><div className="flex items-center gap-3"><BedDouble className="text-blue-800"/><div><p className="text-sm text-slate-500">Occupied / checked in</p><p className="text-2xl font-bold">{active.length}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><IndianRupee className="text-emerald-700"/><div><p className="text-sm text-slate-500">Today's collections</p><p className="text-2xl font-bold">₹{todayCollections.toLocaleString("en-IN")}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><Banknote className="text-amber-700"/><div><p className="text-sm text-slate-500">Cash today</p><p className="text-2xl font-bold">₹{todayCash.toLocaleString("en-IN")}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><CalendarDays className="text-red-700"/><div><p className="text-sm text-slate-500">Outstanding active stays</p><p className="text-2xl font-bold">₹{outstanding.toLocaleString("en-IN")}</p></div></div></div>
      </section>

      {session.role==="hotel_admin"&&<section className={card}><div><h2 className="text-lg font-bold">New walk-in / direct booking</h2><p className="mt-1 text-sm text-slate-600"><b>No Booking ID = No Room Key = No Guest Occupancy.</b> Start your shift before creating a booking.</p></div><form onSubmit={createBooking} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input className={input} placeholder="Guest name" value={newBooking.guestName} onChange={e=>setNewBooking(v=>({...v,guestName:e.target.value}))} required/><input className={input} placeholder="Mobile number" value={newBooking.phone} onChange={e=>setNewBooking(v=>({...v,phone:e.target.value}))}/><input className={input} placeholder="Room number" value={newBooking.roomNo} onChange={e=>setNewBooking(v=>({...v,roomNo:e.target.value}))} required/><select className={input} value={newBooking.source} onChange={e=>setNewBooking(v=>({...v,source:e.target.value}))}><option value="walk_in">Walk-in</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option><option value="website">Website</option><option value="ota">OTA</option><option value="corporate">Corporate</option><option value="referral">Referral</option><option value="management">Management</option></select>
        <input className={input} type="date" value={newBooking.checkInDate} onChange={e=>setNewBooking(v=>({...v,checkInDate:e.target.value}))} required/><input className={input} type="date" value={newBooking.checkOutDate} onChange={e=>setNewBooking(v=>({...v,checkOutDate:e.target.value}))} required/><input className={input} type="number" min="1" placeholder="Nights" value={newBooking.nights} onChange={e=>setNewBooking(v=>({...v,nights:Number(e.target.value)}))} required/><input className={input} type="number" min="0" step="0.01" placeholder="Approved rate / night" value={newBooking.approvedRate} onChange={e=>setNewBooking(v=>({...v,approvedRate:e.target.value}))} required/>
        <input className={input} type="number" min="0" step="0.01" placeholder="Total amount (auto if blank)" value={newBooking.totalAmount} onChange={e=>setNewBooking(v=>({...v,totalAmount:e.target.value}))}/><input className={input} type="number" min="0" step="0.01" placeholder="Amount received now" value={newBooking.amountReceived} onChange={e=>setNewBooking(v=>({...v,amountReceived:e.target.value}))}/><select className={input} value={newBooking.paymentMode} onChange={e=>setNewBooking(v=>({...v,paymentMode:e.target.value}))}><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="bank_transfer">Bank Transfer</option><option value="mixed">Mixed</option></select><input className={input} placeholder="Transaction ref (if applicable)" value={newBooking.transactionRef} onChange={e=>setNewBooking(v=>({...v,transactionRef:e.target.value}))}/>
        <button disabled={busy} className={`${btn} bg-blue-800 text-white hover:bg-blue-900 lg:col-span-4`}><Plus size={16}/>Create Booking & Check In</button>
      </form></section>}

      <section className={card}><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Currently checked-in guests</h2><p className="mt-1 text-sm text-slate-600">Payments stay linked to the booking and user who recorded them.</p></div></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Booking</th><th className="py-3 pr-4">Guest</th><th className="py-3 pr-4">Room</th><th className="py-3 pr-4">Stay</th><th className="py-3 pr-4">Total</th><th className="py-3 pr-4">Paid</th><th className="py-3 pr-4">Balance</th><th className="py-3">Actions</th></tr></thead><tbody>{active.map(b=>{const paid=paidByBooking.get(b.id)??0;const balance=Math.max(0,Number(b.total_amount)-paid);return <tr key={b.id} className="border-b border-slate-100"><td className="py-3 pr-4 font-semibold text-blue-900">{b.booking_code}</td><td className="py-3 pr-4"><span className="font-semibold">{b.guest_name}</span><span className="block text-xs text-slate-500">{b.phone||b.source.replace("_"," ")}</span></td><td className="py-3 pr-4 font-semibold">{b.room_no}</td><td className="py-3 pr-4 text-slate-600">{b.check_in_date} to {b.check_out_date}</td><td className="py-3 pr-4">₹{Number(b.total_amount).toLocaleString("en-IN")}</td><td className="py-3 pr-4 text-emerald-700">₹{paid.toLocaleString("en-IN")}</td><td className={`py-3 pr-4 font-semibold ${balance>0?"text-red-700":"text-emerald-700"}`}>₹{balance.toLocaleString("en-IN")}</td><td className="py-3"><div className="flex flex-wrap gap-2">{session.role==="hotel_admin"&&balance>0&&<button disabled={busy} onClick={()=>setPaymentForm({bookingId:b.id,amount:String(balance),paymentMode:"cash",transactionRef:""})} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900">Add Payment</button>}{session.role==="hotel_admin"&&<button disabled={busy} onClick={()=>void checkout(b.id)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"><CheckCircle2 size={13}/>Checkout</button>}</div></td></tr>})}{active.length===0&&<tr><td colSpan={8} className="py-8 text-center text-slate-500">No checked-in bookings for this hotel.</td></tr>}</tbody></table></div></section>

      {paymentForm&&<section className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="font-bold text-blue-950">Record payment</h2><form onSubmit={recordPayment} className="mt-3 grid gap-2 sm:grid-cols-4"><input className={input} type="number" min="0.01" step="0.01" value={paymentForm.amount} onChange={e=>setPaymentForm(v=>v?{...v,amount:e.target.value}:v)} required/><select className={input} value={paymentForm.paymentMode} onChange={e=>setPaymentForm(v=>v?{...v,paymentMode:e.target.value}:v)}><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="bank_transfer">Bank Transfer</option><option value="mixed">Mixed</option></select><input className={input} placeholder="Transaction ref" value={paymentForm.transactionRef} onChange={e=>setPaymentForm(v=>v?{...v,transactionRef:e.target.value}:v)}/><div className="flex gap-2"><button disabled={busy} className={`${btn} bg-blue-800 text-white`}>Save</button><button type="button" onClick={()=>setPaymentForm(null)} className={`${btn} border border-slate-300 bg-white`}>Cancel</button></div></form></section>}
    </div>
  </main>;
}
