"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { hotels } from "@/data/hotels";

const SAKET = { name: "Saket Banquet Hall", phone: "9346316161", whatsapp: "9346316161" };

export default function HotelEnquiryForm() {
  const [property, setProperty] = useState("");
  const selectedProperty = useMemo(
    () => hotels.find((hotel) => hotel.name === property) ?? (property === SAKET.name ? SAKET : null),
    [property],
  );

  function sendToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProperty) return;
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    if (values.marketingConsent === "yes" && !values.email) {
      event.currentTarget.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    const message = [
      `Hi, I would like to enquire about ${values.enquiryType?.toLowerCase() || "availability"} at ${values.property}.`,
      `Name: ${values.name}`,
      `Mobile: ${values.phone}`,
      values.checkIn ? `${values.enquiryType === "Banquet hall" ? "Event" : "Check-in"} date: ${values.checkIn}` : "",
      values.checkOut ? `Check-out date: ${values.checkOut}` : "",
      values.guests ? `Guests: ${values.guests}` : "",
      values.email ? `Email: ${values.email}` : "",
      values.message ? `Requirement: ${values.message}` : "",
    ].filter(Boolean).join("\n");
    if (values.marketingConsent === "yes") {
      void fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          sourcePage: location.pathname,
          consentSource: "contact_enquiry",
        }),
      });
    }
    window.open(`https://wa.me/91${selectedProperty.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={sendToWhatsApp} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3"><CalendarDays className="text-blue-800" /><h3 className="text-2xl font-bold">Request rooms or event availability</h3></div>
      <p className="mt-3 text-sm leading-6 text-slate-600">Choose a property and send your requirement directly to its WhatsApp number.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Name *<input name="name" required minLength={2} className={inputClass} /></label>
        <label className="text-sm font-semibold">Mobile number *<input name="phone" required inputMode="tel" pattern="[0-9 +()-]{10,20}" className={inputClass} /></label>
        <label className="text-sm font-semibold">Hotel or venue *
          <select name="property" required className={inputClass} value={property} onChange={(event) => setProperty(event.target.value)}>
            <option value="" disabled>Select property</option>
            {hotels.map((hotel) => <option key={hotel.slug} value={hotel.name}>{hotel.name}</option>)}
            <option value={SAKET.name}>{SAKET.name}</option>
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
      <label className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
        <input name="marketingConsent" value="yes" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-blue-800" />
        <span>Send me Supraja Hotels offers, new stay guides and important updates by email or WhatsApp. I can unsubscribe anytime.</span>
      </label>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="submit" disabled={!selectedProperty} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"><MessageCircle size={18} />Send via WhatsApp</button>
        {selectedProperty ? <a href={`tel:+91${selectedProperty.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-blue-800 px-6 font-bold text-blue-800 hover:bg-blue-50"><Phone size={18} />Call {selectedProperty.phone}</a> : <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 font-bold text-slate-400"><Phone size={18} />Select hotel to call</span>}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">WhatsApp opens with your enquiry details ready to send to the selected hotel.</p>
    </form>
  );
}
