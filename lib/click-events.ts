export const CLICK_EVENT_TYPES = [
  "page_view",
  "call_click",
  "whatsapp_click",
  "email_click",
  "booking_click",
  "navigation_click",
] as const;

export type ClickEventType = (typeof CLICK_EVENT_TYPES)[number];

export type ClickEventInput = {
  eventType: ClickEventType;
  pagePath: string;
  pageTitle?: string;
  targetUrl?: string;
  targetLabel?: string;
  visitorId: string;
  sessionId: string;
  referrer?: string;
  screenWidth?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type StoredClickEvent = {
  id: number;
  created_at: string;
  event_type: ClickEventType;
  page_path: string;
  page_title: string | null;
  target_url: string | null;
  target_label: string | null;
  visitor_id: string;
  session_id: string;
  referrer: string | null;
  device_type: string;
  browser: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

export function isClickEventType(value: unknown): value is ClickEventType {
  return (
    typeof value === "string" &&
    CLICK_EVENT_TYPES.includes(value as ClickEventType)
  );
}

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function getDeviceType(userAgent: string, screenWidth?: number) {
  if (
    /tablet|ipad|playbook|silk/i.test(userAgent) ||
    (screenWidth && screenWidth >= 768 && screenWidth < 1024)
  ) {
    return "Tablet";
  }

  if (/mobile|iphone|ipod|android/i.test(userAgent) || (screenWidth && screenWidth < 768)) {
    return "Mobile";
  }

  return "Desktop";
}

export function getBrowser(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Other";
}
