"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, Download, LogOut, Mail, MessageCircle, MousePointerClick, Phone, RefreshCw, Users } from "lucide-react";
import type { ClickEventType, StoredClickEvent } from "@/lib/click-events";

type Period = 1 | 7 | 30 | 90;
type Subscriber = { id: number; created_at: string; email: string; source_page: string; status: string };

const EVENT_LABELS: Record<ClickEventType, string> = { page_view: "Page view", call_click: "Call", whatsapp_click: "WhatsApp", email_click: "Email", booking_click: "Booking", navigation_click: "Navigation" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

function getSource(referrer: string | null, utmSource: string | null) {
  if (utmSource) return utmSource;
  if (!referrer) return "Direct";
  try { return new URL(referrer).hostname.replace(/^www\./, ""); } catch { return referrer; }
}

function csvValue(value: unknown) {
  let output = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(output)) output = `'${output}`;
  return `"${output.replace(/"/g, '""')}"`;
}

function downloadCsv(name: string, headers: string[], rows: unknown[][]) {
  const csv = [headers.map(csvValue).join(","), ...rows.map((row) => row.map(csvValue).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

export default function AdminClicksPage() {
  const [view, setView] = useState<"activity" | "subscribers">("activity");
  const [events, setEvents] = useState<StoredClickEvent[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [period, setPeriod] = useState<Period>(30);
  const [eventType, setEventType] = useState("all");
  const [pageFilter, setPageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    const params = new URLSearchParams({ days: String(period), eventType });
    if (pageFilter.trim()) params.set("page", pageFilter.trim());
    try {
      const [activityResponse, subscriberResponse] = await Promise.all([
        fetch(`/api/admin/click-events?${params}`, { cache: "no-store" }),
        fetch("/api/admin/subscribers", { cache: "no-store" }),
      ]);
      if (activityResponse.status === 401 || subscriberResponse.status === 401) { location.href = "/admin/login"; return; }
      const activityResult = await activityResponse.json() as { events?: StoredClickEvent[]; error?: string };
      const subscriberResult = await subscriberResponse.json() as { subscribers?: Subscriber[]; error?: string };
      if (!activityResponse.ok) throw new Error(activityResult.error || "Unable to load website activity.");
      if (!subscriberResponse.ok) throw new Error(subscriberResult.error || "Unable to load subscribers.");
      setEvents(activityResult.events ?? []); setSubscribers(subscriberResult.subscribers ?? []);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load dashboard data."); }
    finally { setLoading(false); }
  }, [period, eventType, pageFilter]);

  useEffect(() => { const timer = setTimeout(() => void loadData(), 250); return () => clearTimeout(timer); }, [loadData]);

  const metrics = useMemo(() => {
    const pageViews = events.filter((event) => event.event_type === "page_view");
    return {
      visitors: new Set(pageViews.map((event) => event.visitor_id)).size,
      sessions: new Set(pageViews.map((event) => event.session_id)).size,
      pageViews: pageViews.length,
      calls: events.filter((event) => event.event_type === "call_click").length,
      whatsapp: events.filter((event) => event.event_type === "whatsapp_click").length,
    };
  }, [events]);

  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    events.filter((event) => event.event_type === "page_view").forEach((event) => counts.set(event.page_path, (counts.get(event.page_path) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [events]);

  async function logout() { await fetch("/api/admin-logout", { method: "POST" }); location.href = "/admin/login"; }

  const cards = [
    { label: "Visitors", value: metrics.visitors, icon: Users }, { label: "Sessions", value: metrics.sessions, icon: Activity },
    { label: "Page views", value: metrics.pageViews, icon: MousePointerClick }, { label: "Call clicks", value: metrics.calls, icon: Phone },
    { label: "WhatsApp clicks", value: metrics.whatsapp, icon: MessageCircle }, { label: "Subscribers", value: subscribers.length, icon: Mail },
  ];

  return <main className="min-h-screen bg-slate-100 text-slate-950">
    <header className="border-b border-slate-200 bg-slate-950 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Supraja Hotels Admin</p><h1 className="mt-1 text-2xl font-bold">Website dashboard</h1></div><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"><LogOut size={17} />Logout</button></div></header>
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <nav aria-label="Admin sections" className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <button onClick={() => setView("activity")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${view === "activity" ? "bg-blue-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Website activity</button>
        <button onClick={() => setView("subscribers")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${view === "subscribers" ? "bg-blue-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Subscribers</button>
      </nav>

      {view === "activity" && <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-4 md:grid-cols-[160px_180px_1fr_auto_auto]">
        <label><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Period</span><select value={period} onChange={(e) => setPeriod(Number(e.target.value) as Period)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"><option value={1}>Today</option><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label>
        <label><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Activity</span><select value={eventType} onChange={(e) => setEventType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"><option value="all">All activity</option>{Object.entries(EVENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Page contains</span><input value={pageFilter} onChange={(e) => setPageFilter(e.target.value)} placeholder="/hotels/supraja-cyber-view" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
        <button onClick={() => void loadData()} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 font-semibold text-white"><RefreshCw size={17} className={loading ? "animate-spin" : ""} />Refresh</button>
        <button disabled={!events.length} onClick={() => downloadCsv("supraja-hotels-website-activity.csv", ["Date", "Activity", "Page", "Target", "Source", "Device", "Browser"], events.map((e) => [formatDate(e.created_at), EVENT_LABELS[e.event_type], e.page_path, e.target_label, getSource(e.referrer, e.utm_source), e.device_type, e.browser]))} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-blue-800 px-4 py-2.5 font-semibold text-blue-800 disabled:opacity-40"><Download size={17} />Export CSV</button>
      </div></section>}

      {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon size={22} className="text-blue-700" /><p className="mt-5 text-3xl font-bold">{loading ? "..." : value}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p></article>)}</section>

      {view === "activity" ? <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Top pages</h2><p className="mt-1 text-sm text-slate-500">Ranked by page views</p><div className="mt-5 space-y-4">{!loading && !topPages.length && <p className="text-sm text-slate-500">No page views in this period.</p>}{topPages.map(([page, views]) => <div key={page}><div className="flex justify-between gap-4 text-sm"><span className="break-all font-medium text-slate-700">{page}</span><strong>{views}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-700" style={{ width: `${Math.max(8, views / Math.max(topPages[0]?.[1] ?? 1, 1) * 100)}%` }} /></div></div>)}</div></article>
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="text-lg font-bold">Recent website activity</h2><p className="mt-1 text-sm text-slate-500">Latest matching visits and clicks</p></div><CalendarDays className="text-blue-700" /></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Date and time</th><th className="px-5 py-3">Activity</th><th className="px-5 py-3">Page / target</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Device</th></tr></thead><tbody className="divide-y divide-slate-100">{!loading && !events.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">No activity found.</td></tr>}{events.map((event) => <tr key={event.id}><td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(event.created_at)}</td><td className="px-5 py-4 font-semibold">{EVENT_LABELS[event.event_type]}</td><td className="max-w-sm px-5 py-4"><p className="break-all font-semibold">{event.page_path}</p>{event.target_label && <p className="mt-1 text-xs text-slate-500">{event.target_label}</p>}</td><td className="px-5 py-4 text-slate-600">{getSource(event.referrer, event.utm_source)}</td><td className="px-5 py-4 text-slate-600">{event.device_type}<span className="block text-xs text-slate-400">{event.browser}</span></td></tr>)}</tbody></table></div></article>
      </section> : <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="text-lg font-bold">Email subscribers</h2><p className="mt-1 text-sm text-slate-500">People who subscribed on the hotel website</p></div><button disabled={!subscribers.length} onClick={() => downloadCsv("supraja-hotels-subscribers.csv", ["Subscribed", "Email", "Source page", "Status"], subscribers.map((s) => [formatDate(s.created_at), s.email, s.source_page, s.status]))} className="inline-flex items-center gap-2 rounded-xl border border-blue-800 px-4 py-2.5 text-sm font-semibold text-blue-800 disabled:opacity-40"><Download size={17} />Export CSV</button></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Subscribed</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Source page</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{!loading && !subscribers.length && <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-500">No subscribers yet.</td></tr>}{subscribers.map((subscriber) => <tr key={subscriber.id}><td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(subscriber.created_at)}</td><td className="px-5 py-4"><a className="font-semibold text-blue-800" href={`mailto:${subscriber.email}`}>{subscriber.email}</a></td><td className="px-5 py-4 text-slate-600">{subscriber.source_page}</td><td className="px-5 py-4 capitalize">{subscriber.status}</td></tr>)}</tbody></table></div></section>}
      <p className="text-center text-xs text-slate-500">Excluded IP and localhost visits are not counted. Raw IP addresses are not stored.</p>
    </div>
  </main>;
}
