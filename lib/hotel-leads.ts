import { cleanText } from "@/lib/click-events";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "booked", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type HotelLead = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  email: string | null;
  property: string;
  enquiry_type: string;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  source_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && LEAD_STATUSES.includes(value as LeadStatus);
}

export function normaliseLeadInput(body: Record<string, unknown>) {
  const name = cleanText(body.name, 100);
  const phone = cleanText(body.phone, 20).replace(/[^0-9+]/g, "");
  const email = cleanText(body.email, 160).toLowerCase();
  const property = cleanText(body.property, 100);
  const enquiryType = cleanText(body.enquiryType, 60) || "Room booking";
  const checkIn = cleanText(body.checkIn, 10);
  const checkOut = cleanText(body.checkOut, 10);
  const guestsValue = Number(body.guests);

  if (name.length < 2 || phone.replace(/\D/g, "").length < 10 || !property) return null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    name,
    phone,
    email: email || null,
    property,
    enquiry_type: enquiryType,
    check_in: /^\d{4}-\d{2}-\d{2}$/.test(checkIn) ? checkIn : null,
    check_out: /^\d{4}-\d{2}-\d{2}$/.test(checkOut) ? checkOut : null,
    guests: Number.isInteger(guestsValue) && guestsValue > 0 && guestsValue <= 50 ? guestsValue : null,
    message: cleanText(body.message, 1000) || null,
    source_page: cleanText(body.sourcePage, 500) || null,
    referrer: cleanText(body.referrer, 1000) || null,
    utm_source: cleanText(body.utmSource, 200) || null,
    utm_medium: cleanText(body.utmMedium, 200) || null,
    utm_campaign: cleanText(body.utmCampaign, 200) || null,
  };
}
