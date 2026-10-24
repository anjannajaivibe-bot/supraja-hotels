"use client";

import { Suspense, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/FloatingCTA";
import FloatingSubscribe from "@/components/FloatingSubscribe";
import VisitorClickTracker from "@/components/VisitorClickTracker";

// Limit session recordings to the real booking site. Vercel preview URLs and
// localhost can still use other analytics, but must not pollute Clarity.
const productionHosts = new Set(["suprajahotels.com", "www.suprajahotels.com"]);
const hotelsByPhone: Record<string, string> = {
  "9550776161": "supraja-cyber-view",
  "9346316161": "supraja-residency",
  "9348446161": "supraja-lodge",
};
let clarityStoppedForProtectedRoute = false;

type ClarityWindow = Window & {
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
};

function isProtected(pathname: string) {
  return pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/attendance-verify" ||
    pathname.startsWith("/attendance-verify/");
}

function propertyFromPath(path: string): string | undefined {
  if (path === "/saket-banquet-hall" || path.startsWith("/saket-banquet-hall/")) {
    return "saket-banquet-hall";
  }
  const match = path.match(/^\/hotels\/(supraja-cyber-view|supraja-residency|supraja-lodge)(?:\/|$)/);
  return match?.[1];
}

function propertyFromLink(anchor: HTMLAnchorElement): string | undefined {
  const href = anchor.getAttribute("href") ?? "";
  const digits = href.replace(/\D/g, "").slice(-10);
  if (href.startsWith("tel:") || href.includes("wa.me/")) {
    return hotelsByPhone[digits];
  }
  return propertyFromPath(window.location.pathname);
}

function trafficSource(): string | undefined {
  const query = new URLSearchParams(window.location.search);
  if (query.has("fbclid")) return "facebook_click";
  if (query.has("gclid")) return "google_ads_click";
  const utm = (query.get("utm_source") ?? "").trim().toLowerCase();
  if (utm) {
    const known = ["facebook", "instagram", "google", "bing", "whatsapp", "youtube", "email", "direct"];
    return known.includes(utm) ? utm : "other_utm";
  }
  try {
    const referrer = document.referrer ? new URL(document.referrer).hostname : "";
    if (/^(?:www\.)?google\.[a-z.]+$/.test(referrer)) return "google_referral";
    if (/^(?:www\.)?(?:facebook\.com|l\.facebook\.com|m\.facebook\.com|instagram\.com)$/.test(referrer)) {
      return "meta_referral";
    }
  } catch {
    // A malformed referrer must never prevent a booking.
  }
  return undefined;
}

function sendClarityAction(action: string, property?: string) {
  try {
    const clarity = (window as ClarityWindow).clarity;
    if (!clarity) return;
    if (property) clarity("set", "property", property);
    clarity("event", action);
  } catch {
    // Analytics errors must never interfere with booking buttons.
  }
}

function ClarityPublicTracker({ pathname }: { pathname: string }) {
  useLayoutEffect(() => {
    const clarityWindow = window as ClarityWindow;
    const production = productionHosts.has(window.location.hostname);
    if (!production || isProtected(pathname)) {
      if (production && clarityWindow.clarity) {
        clarityWindow.clarity("stop");
        clarityStoppedForProtectedRoute = true;
      }
      return;
    }

    // Once a client-side route entered a protected area, reload on return
    // instead of attempting to resume the stopped recording.
    if (clarityStoppedForProtectedRoute) {
      clarityStoppedForProtectedRoute = false;
      window.location.reload();
      return;
    }

    if (clarityWindow.clarity) return;
    const queue: unknown[][] = [];
    clarityWindow.clarity = Object.assign(
      (...args: unknown[]) => { queue.push(args); },
      { q: queue }
    );
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.clarity.ms/tag/z2k4pm5pcc";
    document.head.appendChild(script);
    clarityWindow.clarity("set", "site_environment", "production");
  }, [pathname]);

  useEffect(() => {
    if (!productionHosts.has(window.location.hostname) || isProtected(pathname)) return;
    const clarity = (window as ClarityWindow).clarity;
    if (!clarity) return;
    const property = propertyFromPath(pathname);
    if (property) clarity("set", "property", property);
    const source = trafficSource();
    if (source) clarity("set", "traffic_source", source);
  }, [pathname]);

  useEffect(() => {
    if (!productionHosts.has(window.location.hostname) || isProtected(pathname)) return;

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.dataset.noTrack === "true") return;
      const href = anchor.getAttribute("href") ?? "";
      let action: string | undefined;
      if (anchor.dataset.trackType === "booking") action = "booking_click";
      else if (href.startsWith("tel:")) action = "call_click";
      else if (href.includes("wa.me/") || href.includes("whatsapp.com/")) action = "whatsapp_click";
      else if (href.startsWith("mailto:")) action = "email_click";
      if (action) sendClarityAction(action, propertyFromLink(anchor));
    };

    const onWhatsAppEnquiry = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const slug = event.detail?.hotelSlug;
      if (typeof slug !== "string" ||
        !["supraja-cyber-view", "supraja-residency", "supraja-lodge", "saket-banquet-hall"].includes(slug)) {
        return;
      }
      // Do not send guest names, phone numbers, or enquiry messages to Clarity.
      sendClarityAction("whatsapp_enquiry_submit", slug);
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("supraja:whatsapp-enquiry", onWhatsAppEnquiry);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("supraja:whatsapp-enquiry", onWhatsAppEnquiry);
    };
  }, [pathname]);

  return null;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isProtected(pathname)) {
    return <><ClarityPublicTracker pathname={pathname} />{children}</>;
  }

  return (
    <>
      <ClarityPublicTracker pathname={pathname} />
      <Header />
      <div className="m-0 block bg-white p-0">{children}</div>
      <Footer />
      <FloatingSubscribe />
      <FloatingCTA />
      <Suspense fallback={null}>
        <VisitorClickTracker />
      </Suspense>
    </>
  );
}
