"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Send } from "lucide-react";
import { hotels } from "@/data/hotels";

export default function HotelEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const params = new URLSearchParams(location.search);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        sourcePage: location.pathname,
        referrer: document.referrer,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      }),
    });
    const result = (await response.json()) as { error?: string };
    setSubmitting(false);
    if (!response.ok) {
      setMessage(result.error ?? "Unable to send your enquiry.");
      return;
    }
    form.reset();
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-[1.75rem] border border-green-200 bg-green-50 p-8 text-green-950">
        <CheckCircle2 size={34} className="text-green-700" />
        <h3 className="mt-4 text-2xl font-bold">Enquiry received</h3>
        <p className="mt-3 leading-7">Our hotel team will contact you shortly. For an urgent booking, please call or WhatsApp the selected property.</p>
        <button type="button" onClick={() => setSuccess(false)} className="mt-5 font-bold text-blue-800 hover:underline">Send another enquiry</button>
      </div>
    );
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3"><CalendarDays className="text-blue-800" /><h3 className="text-2xl font-bold">Request rooms or event availability</h3></div>
      <p className="mt-3 text-sm leading-6 text-slate-600">Share your requirement and the relevant hotel team will call you.</p>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Name *<input name="name" required minLength={2} className={inputClass} /></label>
        <label className="text-sm font-semibold">Mobile number *<input name="phone" required inputMode="tel" pattern="[0-9 +()-]{10,20}" className={inputClass} /></label>
        <label className="text-sm font-semibold">Hotel or venue *
          <select name="property" required className={inputClass} defaultValue="">
            <option value="" disabled>Select property</option>
            {hotels.map((hotel) => <option key={hotel.slug} value={hotel.name}>{hotel.name}</option>)}
            <option value="Saket Banquet Hall">Saket Banquet Hall</option>
          </select>
        </label>
        <label className="text-sm font-semibold">Enquiry type
          <select name="enquiryType" className={inputClass}><option>Room booking</option><option>Corporate stay</option><option>Group booking</option><option>Banquet hall</option><option>Long stay</option></select>
        </label>
        <label className="text-sm font-semibold">Check-in or event date<input name="checkIn" type="date" className={inputClass} /></label>
        <label className="text-sm font-semibold">Check-out date<input name="checkOut" type="date" className={inputClass} /></label>
        <label className="text-sm font-semibold">Guests<input name="guests" type="number" min={1} max={50} className={inputClass} /></label>
        <label className="text-sm font-semibold">Email<input name="email" type="email" className={inputClass} /></label>
      </div>
      <label className="mt-4 block text-sm font-semibold">Requirement<textarea name="message" rows={3} maxLength={1000} className={inputClass} placeholder="Room count, stay purpose, event details or any special request" /></label>
      {message && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{message}</p>}
      <button disabled={submitting} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 font-bold text-white hover:bg-blue-900 disabled:opacity-60"><Send size={17} />{submitting ? "Sending…" : "Send enquiry"}</button>
      <p className="mt-3 text-xs leading-5 text-slate-500">By submitting, you agree that Supraja Hotels may contact you about this enquiry.</p>
    </form>
  );
}
