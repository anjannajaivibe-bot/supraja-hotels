"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, KeyRound, RefreshCw, ShieldCheck, UserPlus, Users } from "lucide-react";

type Session = { username:string; displayName:string; role:"master"|"hotel_admin"; hotelId:string|null; hotelName:string|null };
type Hotel = { id:string; name:string; code?:string };
type User = { id:string; username:string; display_name:string; hotel_id:string; is_active:boolean; created_at:string; hotels?:{name?:string;code?:string}|null };

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function HotelUsersPage() {
  const [session,setSession]=useState<Session|null>(null);
  const [hotels,setHotels]=useState<Hotel[]>([]);
  const [users,setUsers]=useState<User[]>([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [form,setForm]=useState({displayName:"",username:"",password:"",hotelId:""});
  const [reset,setReset]=useState<{id:string;password:string}|null>(null);

  const activeUsers=useMemo(()=>users.filter(u=>u.is_active).length,[users]);

  const load=useCallback(async()=>{
    setMessage("");
    const sessionRes=await fetch("/api/admin/session",{cache:"no-store"});
    if(sessionRes.status===401){window.location.href="/admin/login";return;}
    const sessionData=await sessionRes.json() as {session:Session};
    if(sessionData.session.role!=="master"){window.location.href="/admin/operations";return;}
    setSession(sessionData.session);
    const [hotelRes,userRes]=await Promise.all([
      fetch("/api/admin/hotels",{cache:"no-store"}),
      fetch("/api/admin/hotel-users",{cache:"no-store"}),
    ]);
    const hotelData=await hotelRes.json() as {hotels?:Hotel[]};
    const userData=await userRes.json() as {users?:User[];error?:string};
    const available=hotelData.hotels??[];
    setHotels(available);
    setUsers(userData.users??[]);
    setForm(v=>({...v,hotelId:v.hotelId||available[0]?.id||""}));
    if(!userRes.ok)setMessage(userData.error??"Unable to load hotel users.");
  },[]);

  useEffect(()=>{void load();},[load]);

  async function createUser(e:FormEvent){
    e.preventDefault(); setBusy(true); setMessage("");
    const res=await fetch("/api/admin/hotel-users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const data=await res.json() as {error?:string};
    if(res.ok){setMessage("Hotel login created successfully.");setForm(v=>({displayName:"",username:"",password:"",hotelId:v.hotelId}));await load();}
    else setMessage(data.error??"Unable to create hotel user.");
    setBusy(false);
  }

  async function toggleUser(user:User){
    setBusy(true); setMessage("");
    const res=await fetch("/api/admin/hotel-users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:user.id,action:"toggle_active",isActive:!user.is_active})});
    const data=await res.json() as {error?:string};
    setMessage(res.ok?(user.is_active?"Login disabled.":"Login enabled."):data.error??"Unable to update login.");
    if(res.ok)await load(); setBusy(false);
  }

  async function resetPassword(e:FormEvent){
    e.preventDefault(); if(!reset)return;
    setBusy(true); setMessage("");
    const res=await fetch("/api/admin/hotel-users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:reset.id,action:"reset_password",password:reset.password})});
    const data=await res.json() as {error?:string};
    setMessage(res.ok?"Password reset successfully.":data.error??"Unable to reset password.");
    if(res.ok)setReset(null); setBusy(false);
  }

  if(!session)return <main className="min-h-screen bg-slate-50 p-8 text-slate-600">Loading user management...</main>;

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Supraja Hotels</p><h1 className="mt-1 text-2xl font-bold">Hotel User Access</h1><p className="mt-1 text-sm text-slate-600">Create one individual login for each manager / receptionist. Each login is restricted to one hotel.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/admin/operations" className={`${btn} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}>Operations</Link><button onClick={()=>void load()} className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}><RefreshCw size={16}/>Refresh</button></div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {message&&<div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">{message}</div>}

      <section className="grid gap-4 md:grid-cols-3">
        <div className={card}><div className="flex items-center gap-3"><Users className="text-blue-800"/><div><p className="text-sm text-slate-500">Hotel logins</p><p className="text-2xl font-bold">{users.length}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><ShieldCheck className="text-emerald-700"/><div><p className="text-sm text-slate-500">Active logins</p><p className="text-2xl font-bold">{activeUsers}</p></div></div></div>
        <div className={card}><div className="flex items-center gap-3"><Building2 className="text-blue-800"/><div><p className="text-sm text-slate-500">Properties</p><p className="text-2xl font-bold">{hotels.length}</p></div></div></div>
      </section>

      <section className={card}>
        <div><h2 className="text-lg font-bold">Create hotel login</h2><p className="mt-1 text-sm text-slate-600">Use an employee-specific username. Do not share the same credentials between receptionists.</p></div>
        <form onSubmit={createUser} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <input className={input} placeholder="Employee name" value={form.displayName} onChange={e=>setForm(v=>({...v,displayName:e.target.value}))} required/>
          <input className={input} placeholder="Username" autoCapitalize="none" value={form.username} onChange={e=>setForm(v=>({...v,username:e.target.value}))} required/>
          <input className={input} type="password" placeholder="Initial password" minLength={8} value={form.password} onChange={e=>setForm(v=>({...v,password:e.target.value}))} required/>
          <select className={input} value={form.hotelId} onChange={e=>setForm(v=>({...v,hotelId:e.target.value}))} required>{hotels.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select>
          <button disabled={busy} className={`${btn} bg-blue-800 text-white hover:bg-blue-900`}><UserPlus size={16}/>Create Login</button>
        </form>
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Current hotel users</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Employee</th><th className="py-3 pr-4">Username</th><th className="py-3 pr-4">Hotel</th><th className="py-3 pr-4">Status</th><th className="py-3">Actions</th></tr></thead><tbody>
          {users.map(user=><tr key={user.id} className="border-b border-slate-100"><td className="py-3 pr-4 font-semibold">{user.display_name}</td><td className="py-3 pr-4 text-slate-700">{user.username}</td><td className="py-3 pr-4 text-slate-700">{user.hotels?.name??"Assigned hotel"}</td><td className="py-3 pr-4"><span className={`rounded-full px-2 py-1 text-xs font-bold ${user.is_active?"bg-emerald-100 text-emerald-800":"bg-slate-200 text-slate-700"}`}>{user.is_active?"Active":"Disabled"}</span></td><td className="py-3"><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void toggleUser(user)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">{user.is_active?"Disable":"Enable"}</button><button disabled={busy} onClick={()=>setReset({id:user.id,password:""})} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"><KeyRound size={13}/>Reset password</button></div></td></tr>)}
          {users.length===0&&<tr><td colSpan={5} className="py-8 text-center text-slate-500">No hotel logins created yet.</td></tr>}
        </tbody></table></div>
      </section>

      {reset&&<section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold text-amber-950">Reset password</h2><p className="mt-1 text-sm text-amber-900">Enter a new password of at least 8 characters.</p><form onSubmit={resetPassword} className="mt-3 flex max-w-xl flex-col gap-2 sm:flex-row"><input className={input} type="password" minLength={8} placeholder="New password" value={reset.password} onChange={e=>setReset(v=>v?{...v,password:e.target.value}:v)} required/><button disabled={busy} className={`${btn} bg-amber-700 text-white hover:bg-amber-800`}>Save Password</button><button type="button" onClick={()=>setReset(null)} className={`${btn} border border-amber-300 bg-white text-amber-900`}>Cancel</button></form></section>}
    </div>
  </main>;
}
