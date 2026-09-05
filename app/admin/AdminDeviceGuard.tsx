"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

type State = "checking" | "allowed" | "blocked";

export default function AdminDeviceGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const r = await fetch("/api/admin/session", { cache: "no-store" });
      if (cancelled) return;
      if (r.status === 403) {
        setState("blocked");
        return;
      }
      if (!r.ok) {
        setState("allowed");
        return;
      }
      const d = await r.json();
      if (d.session?.role !== "hotel_admin") {
        setState("allowed");
        return;
      }
      const desktopViewport = window.matchMedia("(min-width: 1024px)").matches;
      setState(desktopViewport ? "allowed" : "blocked");
    })();
    return () => { cancelled = true; };
  }, []);

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (state === "checking") {
    return <main className="min-h-screen bg-slate-50 p-8 text-slate-600">Checking device access...</main>;
  }

  if (state === "blocked") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800">
            <Monitor size={28} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-amber-600">Supraja Hotels</p>
          <h1 className="mt-2 text-2xl font-bold">Desktop Access Only</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Hotel Manager / Receptionist access is restricted to a desktop or laptop computer. Mobile and tablet access is not permitted.
          </p>
          <button onClick={() => void logout()} className="mt-6 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Return to Login
          </button>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
