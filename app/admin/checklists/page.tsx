"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, RefreshCw } from "lucide-react";

type S = { role: "master" | "hotel_admin"; hotelId: string | null; hotelName: string | null };
type H = { id: string; name: string };
type Entry = {
  id: string;
  checklist_type: string;
  item_key: string;
  is_completed: boolean;
  completed_at: string | null;
  completed_by_employee_name: string | null;
  scope_key: string;
  opening_cash_amount?: number | null;
  cash_handover_amount?: number | null;
};
type Templates = { shift_start: [string, string][]; daily: [string, string][]; shift_end: [string, string][] };

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const input = "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm";
const btn = "rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50";

export default function Checklists() {
  const [s, setS] = useState<S | null>(null);
  const [hotels, setHotels] = useState<H[]>([]);
  const [hotel, setHotel] = useState("");
  const [templates, setTemplates] = useState<Templates | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [shift, setShift] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [cashOpen, setCashOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [openingCashOpen, setOpeningCashOpen] = useState(false);
  const [openingCashAmount, setOpeningCashAmount] = useState("");

  const load = useCallback(async () => {
    const sr = await fetch("/api/admin/session", { cache: "no-store" });
    if (sr.status === 401) { location.href = "/admin/login"; return; }
    const sd = await sr.json();
    setS(sd.session);
    const hr = await fetch("/api/admin/hotels", { cache: "no-store" });
    const hd = await hr.json();
    const hs = hd.hotels ?? [];
    setHotels(hs);
    const id = sd.session.role === "hotel_admin" ? sd.session.hotelId : hotel || hs[0]?.id;
    if (!hotel && id) setHotel(id);
    if (!id) return;
    const r = await fetch(`/api/admin/checklists?hotelId=${encodeURIComponent(id)}`, { cache: "no-store" });
    const d = await r.json();
    if (r.ok) { setTemplates(d.templates); setEntries(d.entries ?? []); setShift(d.activeShift ?? null); }
    else setMsg(d.error || "Unable to load checklists");
  }, [hotel]);

  useEffect(() => { void load(); }, [load]);

  const get = (type: string, key: string) => entries.find((e) => e.checklist_type === type && e.item_key === key);

  async function toggle(
    type: "shift_start" | "daily" | "shift_end",
    key: string,
    completed: boolean,
    amounts?: { openingCashAmount?: string; cashHandoverAmount?: string },
  ) {
    setBusy(true);
    const r = await fetch("/api/admin/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklistType: type, itemKey: key, completed, ...amounts }),
    });
    const d = await r.json();
    setMsg(r.ok ? (completed ? "Checklist item completed." : "Checklist item reopened.") : d.error);
    if (r.ok && key === "cash_reconciled") { setCashOpen(false); setCashAmount(""); }
    if (r.ok && key === "cash_opening_verified") { setOpeningCashOpen(false); setOpeningCashAmount(""); }
    await load();
    setBusy(false);
  }

  const sections = useMemo(() => templates ? [
    { type: "shift_start" as const, title: "Shift Start Checklist", desc: "Complete immediately after starting the shift." },
    { type: "daily" as const, title: "Daily Hotel Checklist", desc: "Daily operating checks for the hotel." },
    { type: "shift_end" as const, title: "Shift End Checklist", desc: "Complete before handing over / ending the shift." },
  ] : [], [templates]);

  if (!s) return <main className="p-8">Loading...</main>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-600">Supraja Hotels</p>
            <h1 className="text-2xl font-bold">Operational Checklists</h1>
            <p className="text-sm text-slate-600">Daily and shift-wise controls with employee name and timestamp.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/home" className={`${btn} border bg-white`}>Home</Link>
            <Link href="/admin/attendance" className={`${btn} border bg-white`}>Attendance</Link>
            <button onClick={() => void load()} className={`${btn} bg-slate-900 text-white`}><RefreshCw size={15} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        {s.role === "master" && <section className={card}><select className={input} value={hotel} onChange={(e) => setHotel(e.target.value)}>{hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></section>}
        {msg && <div className="rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-900">{msg}</div>}
        {s.role === "hotel_admin" && !shift && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Start your shift first. Checklist completion is tied to the employee currently on duty.</div>}

        {sections.map((sec) => (
          <section className={card} key={sec.type}>
            <div className="flex items-start gap-3">
              <ClipboardCheck className="mt-1 text-blue-800" />
              <div><h2 className="text-lg font-bold">{sec.title}</h2><p className="text-sm text-slate-600">{sec.desc}</p></div>
            </div>
            <div className="mt-4 space-y-2">
              {(templates?.[sec.type] ?? []).map(([key, label]) => {
                const e = get(sec.type, key);
                const done = Boolean(e?.is_completed);
                const isOpeningCash = sec.type === "shift_start" && key === "cash_opening_verified";
                const isCashHandover = sec.type === "shift_end" && key === "cash_reconciled";
                return (
                  <div key={key} className={`rounded-xl border p-3 ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className={done ? "text-emerald-700" : "text-slate-300"} />
                        <div>
                          <p className="text-sm font-semibold">{label}</p>
                          {done && <p className="mt-1 text-xs text-slate-600">Completed by {e?.completed_by_employee_name || "employee"}{e?.completed_at ? ` · ${new Date(e.completed_at).toLocaleString()}` : ""}</p>}
                          {done && isOpeningCash && <p className="mt-1 text-sm font-bold text-blue-800">Opening cash: ₹{Number(e?.opening_cash_amount ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>}
                          {done && isCashHandover && <p className="mt-1 text-sm font-bold text-emerald-800">Cash handover: ₹{Number(e?.cash_handover_amount ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>}
                        </div>
                      </div>
                      {s.role === "hotel_admin" && <button disabled={busy || !shift} onClick={() => {
                        if (done) void toggle(sec.type, key, false);
                        else if (isOpeningCash) setOpeningCashOpen(true);
                        else if (isCashHandover) setCashOpen(true);
                        else void toggle(sec.type, key, true);
                      }} className={`${btn} ${done ? "border border-slate-300 bg-white" : "bg-blue-800 text-white"}`}>{done ? "Reopen" : "Mark Done"}</button>}
                    </div>

                    {s.role === "hotel_admin" && isOpeningCash && !done && openingCashOpen && (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
                        <label className="block text-sm font-semibold text-slate-900">Opening cash balance <span className="text-red-600">*</span></label>
                        <p className="mt-1 text-xs text-slate-600">Enter the actual cash on hand at the start of this shift. Enter <b>0</b> if there is no opening cash.</p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input autoFocus className={`${input} bg-white`} type="number" min="0" step="0.01" inputMode="decimal" placeholder="₹ 0" value={openingCashAmount} onChange={(ev) => setOpeningCashAmount(ev.target.value)} />
                          <button disabled={busy || openingCashAmount.trim() === "" || Number(openingCashAmount) < 0} onClick={() => void toggle("shift_start", "cash_opening_verified", true, { openingCashAmount })} className={`${btn} bg-blue-800 text-white`}>Save & Mark Done</button>
                          <button disabled={busy} onClick={() => { setOpeningCashOpen(false); setOpeningCashAmount(""); }} className={`${btn} border bg-white`}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {s.role === "hotel_admin" && isCashHandover && !done && cashOpen && (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
                        <label className="block text-sm font-semibold text-slate-900">Cash handover amount <span className="text-red-600">*</span></label>
                        <p className="mt-1 text-xs text-slate-600">Enter the actual cash handed to the next shift. Enter <b>0</b> if there is no cash handover.</p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input autoFocus className={`${input} bg-white`} type="number" min="0" step="0.01" inputMode="decimal" placeholder="₹ 0" value={cashAmount} onChange={(ev) => setCashAmount(ev.target.value)} />
                          <button disabled={busy || cashAmount.trim() === "" || Number(cashAmount) < 0} onClick={() => void toggle("shift_end", "cash_reconciled", true, { cashHandoverAmount: cashAmount })} className={`${btn} bg-blue-800 text-white`}>Save & Mark Done</button>
                          <button disabled={busy} onClick={() => { setCashOpen(false); setCashAmount(""); }} className={`${btn} border bg-white`}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
