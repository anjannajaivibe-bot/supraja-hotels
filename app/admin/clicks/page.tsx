"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  ExternalLink,
  LogOut,
  MessageCircle,
  MousePointerClick,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import type { ClickEventType, StoredClickEvent } from "@/lib/click-events";

type Period = 1 | 7 | 30 | 90;

const EVENT_LABELS: Record<ClickEventType, string> = {
  page_view: "Page view",
  call_click: "Call",
  whatsapp_click: "WhatsApp",
  email_click: "Email",
  booking_click: "Booking",
  navigation_click: "Navigation",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function getSource(referrer: string | null, utmSource: string | null) {
  if (utmSource) return utmSource;
  if (!referrer) return "Direct";

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

function getEventBadge(eventType: ClickEventType) {
  const styles: Record<ClickEventType, string> = {
    page_view: "bg-slate-100 text-slate-700",
    call_click: "bg-blue-100 text-blue-800",
    whatsapp_click: "bg-green-100 text-green-800",
    email_click: "bg-purple-100 text-purple-800",
    booking_click: "bg-amber-100 text-amber-900",
    navigation_click: "bg-cyan-100 text-cyan-800",
  };

  return styles[eventType];
}

function escapeCsvValue(value: string | number | null | undefined) {
  let text = value == null ? "" : String(value);

  // Prevent spreadsheet applications from treating exported text as a formula.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminClicksPage() {
  const [events, setEvents] = useState<StoredClickEvent[]>([]);
  const [period, setPeriod] = useState<Period>(30);
  const [eventType, setEventType] = useState("all");
  const [pageFilter, setPageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      days: String(period),
      eventType,
    });
    if (pageFilter.trim()) params.set("page", pageFilter.trim());

    try {
      const response = await fetch(`/api/admin/click-events?${params}`, {
        cache: "no-store",
      });

      if (response.status === 401) {
        location.href = "/admin/login";
        return;
      }

      const result = (await response.json()) as {
        events?: StoredClickEvent[];
        error?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "Unable to load tracking data.");
        return;
      }

      setEvents(result.events ?? []);
    } catch {
      setError("Unable to load tracking data.");
    } finally {
      setLoading(false);
    }
  }, [period, eventType, pageFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => void loadEvents(), 250);
    return () => clearTimeout(timeout);
  }, [loadEvents]);

  const metrics = useMemo(() => {
    const pageViews = events.filter((event) => event.event_type === "page_view");
    const visitors = new Set(pageViews.map((event) => event.visitor_id)).size;
    const sessions = new Set(pageViews.map((event) => event.session_id)).size;
    const calls = events.filter((event) => event.event_type === "call_click").length;
    const whatsapp = events.filter(
      (event) => event.event_type === "whatsapp_click"
    ).length;
    const actionClicks = events.filter((event) =>
      ["call_click", "whatsapp_click", "email_click", "booking_click"].includes(
        event.event_type
      )
    ).length;

    return { pageViews: pageViews.length, visitors, sessions, calls, whatsapp, actionClicks };
  }, [events]);

  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    events
      .filter((event) => event.event_type === "page_view")
      .forEach((event) => counts.set(event.page_path, (counts.get(event.page_path) ?? 0) + 1));

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [events]);

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    location.href = "/admin/login";
  }

  function exportCsv() {
    if (events.length === 0) return;

    const headers = [
      "Date and time (IST)",
      "Activity",
      "Page path",
      "Page title",
      "Target label",
      "Target URL",
      "Source",
      "Referrer",
      "Device",
      "Browser",
      "Visitor ID",
      "Session ID",
      "UTM source",
      "UTM medium",
      "UTM campaign",
    ];

    const rows = events.map((event) => [
      formatDate(event.created_at),
      EVENT_LABELS[event.event_type],
      event.page_path,
      event.page_title,
      event.target_label,
      event.target_url,
      getSource(event.referrer, event.utm_source),
      event.referrer,
      event.device_type,
      event.browser,
      event.visitor_id,
      event.session_id,
      event.utm_source,
      event.utm_medium,
      event.utm_campaign,
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    link.href = downloadUrl;
    link.download = `supraja-hotels-web-clicks-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  const cards = [
    { label: "Visitors", value: metrics.visitors, icon: Users, color: "text-blue-700" },
    { label: "Sessions", value: metrics.sessions, icon: Activity, color: "text-indigo-700" },
    { label: "Page views", value: metrics.pageViews, icon: MousePointerClick, color: "text-slate-700" },
    { label: "Call clicks", value: metrics.calls, icon: Phone, color: "text-blue-700" },
    { label: "WhatsApp clicks", value: metrics.whatsapp, icon: MessageCircle, color: "text-green-700" },
    { label: "Lead-action clicks", value: metrics.actionClicks, icon: ExternalLink, color: "text-amber-700" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Supraja Hotels Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold">Website clicks</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[180px_220px_1fr_auto_auto]">
            <label>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Period</span>
              <select
                value={period}
                onChange={(event) => setPeriod(Number(event.target.value) as Period)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              >
                <option value={1}>Today</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </label>

            <label>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Activity</span>
              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              >
                <option value="all">All activity</option>
                {Object.entries(EVENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Page contains</span>
              <input
                value={pageFilter}
                onChange={(event) => setPageFilter(event.target.value)}
                placeholder="/hotels/supraja-cyber-view"
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              />
            </label>

            <button
              type="button"
              onClick={() => void loadEvents()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 font-semibold text-white hover:bg-blue-900"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportCsv}
              disabled={loading || events.length === 0}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-blue-800 px-4 py-2.5 font-semibold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </section>

        {error && (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </p>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon size={22} className={color} />
              <p className="mt-5 text-3xl font-bold">{loading ? "…" : value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Top pages</h2>
            <p className="mt-1 text-sm text-slate-500">Ranked by page views</p>
            <div className="mt-5 space-y-4">
              {topPages.length === 0 && !loading && (
                <p className="text-sm text-slate-500">No page views in this period.</p>
              )}
              {topPages.map(([page, views]) => (
                <div key={page}>
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="break-all font-medium text-slate-700">{page}</span>
                    <span className="font-bold">{views}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-700"
                      style={{
                        width: `${Math.max(
                          8,
                          (views / Math.max(topPages[0]?.[1] ?? 1, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold">Recent activity</h2>
                <p className="mt-1 text-sm text-slate-500">Latest 1,000 matching events</p>
              </div>
              <CalendarDays className="text-blue-700" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Date and time</th>
                    <th className="px-5 py-3">Activity</th>
                    <th className="px-5 py-3">Page / target</th>
                    <th className="px-5 py-3">Source</th>
                    <th className="px-5 py-3">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!loading && events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                        No activity found for these filters.
                      </td>
                    </tr>
                  )}
                  {events.map((event) => (
                    <tr key={event.id} className="align-top hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(event.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getEventBadge(event.event_type)}`}>
                          {EVENT_LABELS[event.event_type]}
                        </span>
                      </td>
                      <td className="max-w-sm px-5 py-4">
                        <p className="break-all font-semibold text-slate-800">{event.page_path}</p>
                        {event.target_label && (
                          <p className="mt-1 break-all text-xs text-slate-500">{event.target_label}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {getSource(event.referrer, event.utm_source)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {event.device_type}
                        <span className="block text-xs text-slate-400">{event.browser}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <p className="text-center text-xs text-slate-500">
          Your excluded IP and localhost visits are not counted. Raw IP addresses are not stored.
        </p>
      </div>
    </main>
  );
}
