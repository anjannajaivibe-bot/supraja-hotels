"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Clock3, LogOut, Play, RefreshCw, UserPlus, Users } from "lucide-react";

type Session = { username:string; displayName:string; role:"master"|"hotel_admin"; hotelId:string|null; hotelName:string|null };
type Hotel = { id:string; name:string; code?:string };
type Shift = { id:string; hotel_id:string; admin_username:string; display_name:string; started_at:string; ended_at:string|null; status:string; handover_note:string|null };
type Staff = { id:string; hotel_id:string; name:string; staff_type:string; phone:string|null };
type Attendance = { id:string; staff_member_id:string; attendance_date:string; status:string; recorded_by:string; hotel_staff_members?:{name?:string;staff_type?:string}|null };

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function OperationsPage() {
  const [session,setSession]=useState<Session|null>(null);
  const [hotels,setHotels]=useState<Hotel[]>([]);
  const [selectedHotel,setSelectedHotel]=useState("");
  const [shifts,setShifts]=useState<Shift[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [attendance,setAttendance]=useState<Attendance[]>([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [newStaff,setNewStaff]=useState({name:"",phone:""});
  const [shiftNote,setShiftNote]=useState("");

  const activeShift = useMemo(() => shifts.find((s)=>s.status==="active" && session && s.admin_username===session.username),[shifts,session]);

  const load = useCallback(async () => {
    setMessage("");
    const sessionRes = await fetch("/api/admin/session",{cache:"no-store"});
    if (sessionRes.status===401) { window.location.href="/admin/login"; return; }
    const sessionData = await sessionRes.json() as {session:Session};
    setSession(sessionData.session);

    const hotelRes = await fetch("/api/admin/hotels",{cache:"no-store"});
    const hotelData = await hotelRes.json() as {hotels?:Hotel[]};
    const available = hotelData.hotels ?? [];
    setHotels(available);
    const hotelId = sessionData.session.role==="hotel_admin" ? sessionData.session.hotelId ?? "" : selectedHotel || available[0]?.id || "";
    if (!selectedHotel && hotelId) setSelectedHotel(hotelId);
    const query = hotelId ? `?hotelId=${encodeURIComponent(hotelId)}` : "";
    const [shiftRes,staffRes,attendanceRes] = await Promise.all([
      fetch(`/api/admin/shifts${query}`,{cache:"no-store"}),
      fetch(`/api/admin/staff${query}`,{cache:"no-store"}),
      fetch(`/api/admin/staff-attendance${query}`,{cache:"no-store"}),
    ]);
    const shiftData=await shiftRes.json() as {shifts?:Shift[]};
    const staffData=await staffRes.json() as {staff?:Staff[]};
    const attData=await attendanceRes.json() as {attendance?:Attendance[]};
    setShifts(shiftData.shifts ?? []); setStaff(staffData.staff ?? []); setAttendance(attData.attendance ?? []);
  },[selectedHotel]);

  useEffect(()=>{ void load(); },[load]);

  async function shiftAction(action:"start"|"end") {
    setBusy(true); setMessage("");
    const res=await fetch("/api/admin/shifts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,note:shiftNote})});
    const data=await res.json() as {error?:string};
    setMessage(res.ok ? (action==="start"?"Shift started successfully.":"Shift ended successfully.") : data.error ?? "Unable to update shift.");
    if (res.ok) setShiftNote("");
    await load(); setBusy(false);
  }

  async function addStaff(e:FormEvent) {
    e.preventDefault(); if(!newStaff.name.trim()) return;
    setBusy(true);
    const res=await fetch("/api/admin/staff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...newStaff,hotelId:selectedHotel,staffType:"cleaning"})});
    const data=await res.json() as {error?:string};
    setMessage(res.ok?"Cleaning staff member added.":data.error??"Unable to add staff.");
    if(res.ok)setNewStaff({name:"",phone:""});
    await load(); setBusy(false);
  }

  async function markAttendance(staffMemberId:string,status:string) {
    setBusy(true);
    const res=await fetch("/api/admin/staff-attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({staffMemberId,hotelId:selectedHotel,status})});
    const data=await res.json() as {error?:string};
    setMessage(res.ok?"Attendance recorded.":data.error??"Unable to save attendance.");
    await load(); setBusy(false);
  }

  async function logout(){ await fetch("/api/admin-logout",{method:"POST"}); window.location.href="/admin/login"; }

  if(!session) return <main className="min-h-screen bg-slate-50 p-8 text-slate-600">Loading hotel operations...</main>;

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Supraja Hotels</p><h1 className="mt-1 text-2xl font-bold">Operations Control</h1><p className="mt-1 text-sm text-slate-600">Simple daily controls for attendance, shifts and hotel accountability.</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm"><span className="font-semibold">{session.displayName}</span><span className="ml-2 text-slate-500">{session.role==="master"?"Master Admin":session.hotelName}</span></div>
          <button onClick={()=>void load()} className={`${btn} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}><RefreshCw size={16}/>Refresh</button>
          <button onClick={()=>void logout()} className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}><LogOut size={16}/>Logout</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {session.role==="master" && <section className={card}><label className="block max-w-sm"><span className="mb-2 block text-sm font-semibold">Hotel to monitor</span><select className={input} value={selectedHotel} onChange={(e)=>setSelectedHotel(e.target.value)}>{hotels.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></label></section>}
      {message && <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">{message}</div>}

      <section className="grid gap-4 md:grid-cols-3">
        <div className={card}><div className="flex items-center gap-3"><Clock3 className="text-blue-800"/><div><p className="text-sm text-slate-500">Current shift</p><p className="font-bold">{activeShift?"On duty":"No active shift"}</p></div></div>{activeShift&&<p className="mt-3 text-xs text-slate-500">Started {new Date(activeShift.started_at).toLocaleString()}</p>}</div>
        <div className={card}><div className="flex items-center gap-3"><Users className="text-blue-800"/><div><p className="text-sm text-slate-500">Cleaning staff</p><p className="text-2xl font-bold">{staff.length}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><Building2 className="text-blue-800"/><div><p className="text-sm text-slate-500">Today marked</p><p className="text-2xl font-bold">{attendance.length}</p></div></div></div>
      </section>

      {session.role==="hotel_admin" && <section className={card}><h2 className="text-lg font-bold">My shift</h2><p className="mt-1 text-sm text-slate-600">Your own start/end time is system-recorded and cannot be backdated by you.</p><textarea className={`${input} mt-4 min-h-20`} placeholder="Optional shift / handover note" value={shiftNote} onChange={(e)=>setShiftNote(e.target.value)}/><div className="mt-3 flex gap-2">{!activeShift?<button disabled={busy} onClick={()=>void shiftAction("start")} className={`${btn} bg-blue-800 text-white hover:bg-blue-900`}><Play size={16}/>Start Shift</button>:<button disabled={busy} onClick={()=>void shiftAction("end")} className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}><Clock3 size={16}/>End Shift</button>}</div></section>}

      <section className={card}><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold">Cleaning staff attendance</h2><p className="mt-1 text-sm text-slate-600">Manager / receptionist records support staff attendance. Every entry keeps the recorder identity.</p></div></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Staff</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Today</th><th className="py-3">Mark attendance</th></tr></thead><tbody>{staff.map(member=>{const a=attendance.find(x=>x.staff_member_id===member.id);return <tr key={member.id} className="border-b border-slate-100"><td className="py-3 pr-4 font-semibold">{member.name}</td><td className="py-3 pr-4 capitalize text-slate-600">{member.staff_type}</td><td className="py-3 pr-4 capitalize">{a?.status?.replace("_"," ")??"Not marked"}</td><td className="py-3"><div className="flex flex-wrap gap-1.5">{["present","absent","leave","half_day"].map(status=><button disabled={busy} key={status} onClick={()=>void markAttendance(member.id,status)} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50">{status.replace("_"," ")}</button>)}</div></td></tr>})}{staff.length===0&&<tr><td colSpan={4} className="py-8 text-center text-slate-500">No cleaning staff added yet.</td></tr>}</tbody></table></div>
      </section>

      <section className={card}><h2 className="text-lg font-bold">Add cleaning staff</h2><form onSubmit={addStaff} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input className={input} placeholder="Staff name" value={newStaff.name} onChange={(e)=>setNewStaff(v=>({...v,name:e.target.value}))} required/><input className={input} placeholder="Phone (optional)" value={newStaff.phone} onChange={(e)=>setNewStaff(v=>({...v,phone:e.target.value}))}/><button disabled={busy||!selectedHotel} className={`${btn} bg-blue-800 text-white hover:bg-blue-900`}><UserPlus size={16}/>Add Staff</button></form></section>

      <section className={card}><h2 className="text-lg font-bold">Recent shift history</h2><div className="mt-4 space-y-2">{shifts.slice(0,8).map(s=><div key={s.id} className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"><div><span className="font-semibold">{s.display_name}</span><span className="ml-2 text-slate-500">{new Date(s.started_at).toLocaleString()}</span></div><span className={`w-fit rounded-full px-2 py-1 text-xs font-bold ${s.status==="active"?"bg-emerald-100 text-emerald-800":"bg-slate-200 text-slate-700"}`}>{s.status}</span></div>)}</div></section>
    </div>
  </main>;
}
