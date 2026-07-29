"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { ClickEventInput, ClickEventType } from "@/lib/click-events";

const VISITOR_KEY = "supraja_hotels_visitor_id";
const SESSION_KEY = "supraja_hotels_session";
const SESSION_LENGTH_MS = 30 * 60 * 1000;

type SessionRecord = {
  id: string;
  expiresAt: number;
};

function randomId() {
  return globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id = randomId();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function getSessionId() {
  const now = Date.now();

  try {
    const existing = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) ?? "null"
    ) as SessionRecord | null;

    if (existing?.id && existing.expiresAt > now) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: existing.id, expiresAt: now + SESSION_LENGTH_MS })
      );
      return existing.id;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }

  const session = { id: randomId(), expiresAt: now + SESSION_LENGTH_MS };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session.id;
}

function sendEvent(event: Omit<ClickEventInput, "visitorId" | "sessionId">) {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return;
  }

  const payload: ClickEventInput = {
    ...event,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    pageTitle: document.title,
    referrer: document.referrer,
    screenWidth: window.innerWidth,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/click-events",
      new Blob([body], { type: "application/json" })
    );
    return;
  }

  void fetch("/api/click-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
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

    const params = new URLSearchParams(query);

    sendEvent({
      eventType: "page_view",
      pagePath: query ? `${pathname}?${query}` : pathname,
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
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

    document.addEventListener("click", trackClick, { capture: true });
    return () => document.removeEventListener("click", trackClick, { capture: true });
  }, []);

  return null;
}
