"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterSubscribe() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sourcePage: location.pathname }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={subscribe} className="mt-5">
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-900 focus-within:border-amber-400">
        <input id="footer-email" name="email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
        <button disabled={status === "loading"} className="bg-amber-400 px-4 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60">{status === "loading" ? "Saving..." : "Subscribe"}</button>
      </div>
      <p aria-live="polite" className={`mt-2 text-xs ${status === "error" ? "text-red-300" : "text-slate-400"}`}>
        {status === "success" ? "You are subscribed." : status === "error" ? "Unable to subscribe. Please try again." : "Get hotel offers and useful stay updates."}
      </p>
    </form>
  );
}
