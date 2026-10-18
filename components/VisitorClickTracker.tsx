"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { ClickEventInput, ClickEventType } from "@/lib/click-events";

const VISITOR_KEY = "supraja_hotels_visitor_id";
const SESSION_KEY = "supraja_hotels_session";
const SESSION_LENGTH_MS = 30 * 60 * 1000;
const ATTRIBUTION_KEY = "supraja_hotels_attribution";

type SessionRecord = {
  id: string;
  expiresAt: number;
};

type Attribution = Pick<ClickEventInput, "utmSource" | "utmMedium" | "utmCampaign">;
type AttributionRecord = Attribution & { sessionId: string };
let memoryVisitorId: string | undefined;
let memorySession: SessionRecord | undefined;
let memoryAttribution: AttributionRecord | undefined;

function randomId() {
  return globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
  try {
    memoryVisitorId = localStorage.getItem(VISITOR_KEY) || memoryVisitorId || randomId();
    localStorage.setItem(VISITOR_KEY, memoryVisitorId);
  } catch {
    memoryVisitorId ??= randomId();
  }
  return memoryVisitorId;
}

function getSessionId() {
  const now = Date.now();
  try {
    const existing = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null") as SessionRecord | null;
    if (typeof existing?.id === "string" && typeof existing.expiresAt === "number" && existing.expiresAt > now) {
      memorySession = existing;
    }
  } catch {
    // Keep enquiry tracking usable when browser storage is unavailable.
  }
  if (!memorySession || memorySession.expiresAt <= now) {
    memorySession = { id: randomId(), expiresAt: now + SESSION_LENGTH_MS };
  }
  memorySession.expiresAt = now + SESSION_LENGTH_MS;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(memorySession));
  } catch {
    // The in-memory session still groups this visit's contact clicks.
  }
  return memorySession.id;
}

function getAttribution(sessionId: string): Attribution {
  const params = new URLSearchParams(location.search);
  const clean = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 200) || undefined : undefined;
  const current: Attribution = {
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
  };
  if (current.utmSource || current.utmMedium || current.utmCampaign) {
    memoryAttribution = { sessionId, ...current };
  } else {
    try {
      const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "null") as AttributionRecord | null;
      if (stored?.sessionId === sessionId) memoryAttribution = stored;
    } catch {
      // Use the current visit's in-memory campaign when storage is blocked.
    }
  }
  if (memoryAttribution?.sessionId !== sessionId) return {};
  const attribution: Attribution = {
    utmSource: clean(memoryAttribution.utmSource),
    utmMedium: clean(memoryAttribution.utmMedium),
    utmCampaign: clean(memoryAttribution.utmCampaign),
  };
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ sessionId, ...attribution }));
  } catch {
    // Storage restrictions must never interfere with contacting a hotel.
  }
  return attribution;
}

function sendAnalyticsContact(eventType: ClickEventType, hotelSlug?: string) {
  if (!["call_click", "whatsapp_click", "email_click", "booking_click"].includes(eventType)) return;
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
  try {
    analytics.gtag?.("event", eventType, {
      event_category: "enquiry",
      page_path: location.pathname,
      hotel_slug: hotelSlug ?? location.pathname.match(/^\/hotels\/([^/]+)/)?.[1] ??
        (location.pathname === "/saket-banquet-hall" ? "saket-banquet-hall" : "group"),
      transport_type: "beacon",
    });
  } catch {
    // Contact links work independently of analytics availability.
  }
}

function sendEvent(event: Omit<ClickEventInput, "visitorId" | "sessionId">, hotelSlug?: string) {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  const sessionId = getSessionId();
  const payload: ClickEventInput = {
    ...event,
    ...getAttribution(sessionId),
    visitorId: getVisitorId(),
    sessionId,
    pageTitle: document.title,
    referrer: document.referrer,
    screenWidth: window.innerWidth,
  };
  sendAnalyticsContact(event.eventType, hotelSlug);
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.("/api/click-events", new Blob([body], { type: "application/json" }))) return;
  } catch {
    // Fall back if the browser rejects a beacon during navigation.
  }
  void fetch("/api/click-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function classifyLink(anchor: HTMLAnchorElement): ClickEventType {
  const href = anchor.href;
  const trackingType = anchor.dataset.trackType;

  if (trackingType === "booking") return "booking_click";
  if (href.startsWith("tel:")) return "call_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.includes("wa.me") || href.includes("whatsapp.com")) {
    return "whatsapp_click";
  }

  return "navigation_click";
}

export default function VisitorClickTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    sendEvent({
      eventType: "page_view",
      pagePath: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, query]);

  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.dataset.noTrack === "true") return;

      const label =
        anchor.dataset.trackLabel ||
        anchor.getAttribute("aria-label") ||
        anchor.textContent?.replace(/\s+/g, " ").trim() ||
        "Link";

      sendEvent({
        eventType: classifyLink(anchor),
        pagePath: `${location.pathname}${location.search}`,
        targetUrl: anchor.href,
        targetLabel: label,
      });
    };

    const trackEnquiry = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail = event.detail as { hotelSlug?: unknown; hotelName?: unknown; whatsapp?: unknown } | null;
      if (!detail || typeof detail.hotelSlug !== "string" ||
        !["supraja-cyber-view", "supraja-residency", "supraja-lodge", "saket-banquet-hall"].includes(detail.hotelSlug) ||
        typeof detail.hotelName !== "string" || typeof detail.whatsapp !== "string" || !/^\d{10}$/.test(detail.whatsapp)) return;
      sendEvent({
        eventType: "whatsapp_click",
        pagePath: `${location.pathname}${location.search}`,
        targetUrl: `https://wa.me/91${detail.whatsapp}`,
        targetLabel: `Availability enquiry: ${detail.hotelName.slice(0, 100)}`,
      }, detail.hotelSlug);
    };

    document.addEventListener("click", trackClick, { capture: true });
    document.addEventListener("supraja:whatsapp-enquiry", trackEnquiry);
    return () => {
      document.removeEventListener("click", trackClick, { capture: true });
      document.removeEventListener("supraja:whatsapp-enquiry", trackEnquiry);
    };
  }, []);

  return null;
}
