"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Bell, X } from "lucide-react";

export default function FloatingSubscribe() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, sourcePage: location.pathname, consentSource: "floating_form" }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setStatus("idle"); }}
        className="fixed bottom-20 right-4 z-[9998] inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-400 px-4 text-sm font-bold text-slate-950 shadow-xl transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 md:bottom-44 md:right-5"
        aria-label="Subscribe for Supraja Hotels updates"
      >
        <Bell size={18} aria-hidden="true" />
        <span>Get Updates</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-slate-950/65 p-4 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="subscribe-title" className="w-full max-w-md rounded-[1.75rem] bg-white p-6 text-slate-950 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Supraja Hotels</p><h2 id="subscribe-title" className="mt-2 text-2xl font-bold">Get hotel updates</h2></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close subscription form" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"><X size={21} /></button>
            </div>
            {status === "success" ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-5 text-green-900"><p className="font-bold">Subscription confirmed</p><p className="mt-2 text-sm leading-6">You will receive Supraja Hotels offers, new stay guides and important updates.</p><button type="button" onClick={() => setOpen(false)} className="mt-4 font-bold text-blue-800 hover:underline">Close</button></div>
            ) : (
              <form onSubmit={subscribe} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold">Name *<input name="name" required minLength={2} autoFocus className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="block text-sm font-semibold">Email address *<input name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="block text-sm font-semibold">Phone number *<input name="phone" type="tel" inputMode="tel" required pattern="[0-9 +()-]{10,20}" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label>
                <p className="text-xs leading-5 text-slate-500">By subscribing, you agree to receive hotel offers and updates by email or WhatsApp. You can unsubscribe anytime.</p>
                {status === "error" && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">Unable to subscribe. Please try again.</p>}
                <button disabled={status === "loading"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 font-bold text-white hover:bg-blue-900 disabled:opacity-60"><Bell size={18} />{status === "loading" ? "Subscribing..." : "Subscribe for updates"}</button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
