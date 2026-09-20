"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Clock3, IndianRupee, LogOut, Search, UserRoundPlus } from "lucide-react";

type Session = {
  role: "master" | "hotel_admin";
  hotelId: string | null;
  hotelName?: string | null;
};

type Hotel = { id: string; name: string };

type DayUseRecord = {
  id: string;
  hotelId: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  stayHours: number;
  price: number;
  checkedInAt: string;
  checkedOutAt: string | null;
  status: "checked_in" | "checked_out";
  createdBy: string;
  employeeName: string | null;
  checkedOutBy: string | null;
};

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const button = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";

function todayIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function firstDayOfMonth() {
  const parts = todayIndia().split("-");
  return `${parts[0]}-${parts[1]}-01`;
}

function fmtDateTime(value: string | null) {
  if (!value) return "Not checked out";
  return new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DayUseGuestsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelId, setHotelId] = useState("");
  const [records, setRecords] = useState<DayUseRecord[]>([]);
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState(firstDayOfMonth());
  const [to, setTo] = useState(todayIndia());
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaarNo: "",
    stayHours: "3",
    price: "",
  });

  const load = useCallback(async () => {
    const sessionRes = await fetch("/api/admin/session", { cache: "no-store" });
    if (sessionRes.status === 401) {
      location.href = "/admin/login";
      return;
    }
    const sessionData = await sessionRes.json();
    const currentSession = sessionData.session as Session;
    setSession(currentSession);

    const hotelsRes = await fetch("/api/admin/hotels", { cache: "no-store" });
    const hotelRows = hotelsRes.ok ? ((await hotelsRes.json()).hotels ?? []) as Hotel[] : [];
    setHotels(hotelRows);

    const selectedHotel =
      currentSession.role === "hotel_admin"
        ? currentSession.hotelId || ""
        : hotelId || hotelRows[0]?.id || "";

    if (!hotelId && selectedHotel) setHotelId(selectedHotel);
    if (!selectedHotel) return;

    const params = new URLSearchParams({
      hotelId: selectedHotel,
      status,
      from,
      to,
    });
    const response = await fetch(`/api/admin/day-use?${params.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setRecords(data.records ?? []);
    else setMessage(data.error || "Unable to load day-use guest records.");
  }, [from, hotelId, status, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((record) =>
      [record.name, record.phone, record.aadhaarMasked, record.employeeName || ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [records, search]);

  async function checkIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/admin/day-use", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(response.ok ? "Day-use guest checked in successfully." : data.error || "Unable to check in guest.");

    if (response.ok) {
      setForm({ name: "", phone: "", aadhaarNo: "", stayHours: "3", price: "" });
      await load();
    }
    setBusy(false);
  }

  async function checkOut(id: string) {
    if (!window.confirm("Check out this day-use guest now? The checkout time will be recorded automatically and cannot be edited.")) return;
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/admin/day-use", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "checkout" }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Guest checked out. Checkout time has been recorded." : data.error || "Unable to check out guest.");
    await load();
    setBusy(false);
  }

  if (!session) return <main className="min-h-screen bg-slate-50 p-8 text-slate-600">Loading day-use register...</main>;

  const selectedHotelName =
    session.role === "hotel_admin"
      ? session.hotelName || "Your hotel"
      : hotels.find((hotel) => hotel.id === hotelId)?.name || "Selected hotel";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-600">Supraja Hotels</p>
          <h1 className="mt-1 text-2xl font-bold">Day Use Guests</h1>
          <p className="mt-1 text-sm text-slate-600">
            Hourly-stay guest register for {selectedHotelName}. Check-in and check-out times are system stamped for audit.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        {message && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-900">
            {message}
          </div>
        )}

        {session.role === "hotel_admin" && (
          <section className={card}>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-800">
                <UserRoundPlus size={20} />
              </div>
              <div>
                <h2 className="font-bold">Check In Day Use Guest</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Hours and price are fixed when the record is created. Check-in time is captured automatically.
                </p>
              </div>
            </div>

            <form onSubmit={checkIn} className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <label className="text-xs font-semibold text-slate-700">
                Name
                <input
                  className={`${input} mt-1.5`}
                  value={form.name}
                  onChange={(e) => setForm((value) => ({ ...value, name: e.target.value }))}
                  maxLength={120}
                  required
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Phone
                <input
                  className={`${input} mt-1.5`}
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm((value) => ({ ...value, phone: e.target.value }))}
                  required
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Aadhaar No.
                <input
                  className={`${input} mt-1.5`}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={14}
                  placeholder="12 digits"
                  value={form.aadhaarNo}
                  onChange={(e) => setForm((value) => ({ ...value, aadhaarNo: e.target.value }))}
                  required
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                No. of Hours Stay
                <input
                  className={`${input} mt-1.5`}
                  type="number"
                  min={1}
                  max={24}
                  step={1}
                  value={form.stayHours}
                  onChange={(e) => setForm((value) => ({ ...value, stayHours: e.target.value }))}
                  required
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Price
                <div className="relative mt-1.5">
                  <IndianRupee className="absolute left-3 top-3 text-slate-400" size={15} />
                  <input
                    className={`${input} pl-8`}
                    type="number"
                    min={0}
                    max={100000}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((value) => ({ ...value, price: e.target.value }))}
                    required
                  />
                </div>
              </label>

              <div className="md:col-span-2 lg:col-span-5 flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 size={14} />
                  No manual time entry. The server records the exact check-in timestamp.
                </p>
                <button disabled={busy} className={`${button} bg-blue-800 text-white hover:bg-blue-900`}>
                  <Clock3 size={16} />
                  Check In Guest
                </button>
              </div>
            </form>
          </section>
        )}

        <section className={card}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-bold">Day Use Register</h2>
              <p className="mt-1 text-xs text-slate-500">Completed records remain stored for future audit and cannot be deleted from this panel.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {session.role === "master" && (
                <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Hotel
                  <select className={`${input} mt-1 normal-case`} value={hotelId} onChange={(e) => setHotelId(e.target.value)}>
                    {hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                  </select>
                </label>
              )}

              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
                <select className={`${input} mt-1 normal-case`} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="all">All</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                </select>
              </label>

              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                From
                <input className={`${input} mt-1 normal-case`} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>

              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                To
                <input className={`${input} mt-1 normal-case`} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>

              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Search
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={15} />
                  <input
                    className={`${input} pl-8 normal-case`}
                    placeholder="Name / phone / Aadhaar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Aadhaar</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Check In</th>
                  <th className="px-4 py-3">Check Out</th>
                  <th className="px-4 py-3">Recorded By</th>
                  <th className="px-4 py-3">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((record) => (
                  <tr key={record.id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{record.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{record.aadhaarMasked}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.stayHours} hr{record.stayHours === 1 ? "" : "s"}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">₹{record.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 min-w-44">{fmtDateTime(record.checkedInAt)}</td>
                    <td className="px-4 py-3 min-w-44">{fmtDateTime(record.checkedOutAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{record.employeeName || record.createdBy}</p>
                      {record.employeeName && <p className="text-xs text-slate-500">{record.createdBy}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {record.status === "checked_in" ? (
                        <button
                          disabled={busy || session.role !== "hotel_admin"}
                          onClick={() => void checkOut(record.id)}
                          className={`${button} bg-emerald-700 text-white hover:bg-emerald-800`}
                        >
                          <LogOut size={15} />
                          Check Out
                        </button>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          Checked Out
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">
                      No day-use guest records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
