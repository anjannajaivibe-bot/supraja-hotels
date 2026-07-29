import { NextResponse, type NextRequest } from "next/server";
import {
  cleanText,
  getBrowser,
  getDeviceType,
  isClickEventType,
  type ClickEventInput,
} from "@/lib/click-events";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

const EXCLUDED_IPS = new Set(
  (process.env.TRACKING_EXCLUDED_IPS ?? "115.98.88.203")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean)
);

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (EXCLUDED_IPS.has(ip)) {
    return new NextResponse(null, { status: 204 });
  }

  let body: ClickEventInput;

  try {
    body = (await request.json()) as ClickEventInput;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !isClickEventType(body.eventType) ||
    !cleanText(body.pagePath, 500) ||
    !cleanText(body.visitorId, 100) ||
    !cleanText(body.sessionId, 100)
  ) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  const userAgent = cleanText(request.headers.get("user-agent"), 500);
  const screenWidth =
    typeof body.screenWidth === "number" ? body.screenWidth : undefined;

  const event = {
    event_type: body.eventType,
    page_path: cleanText(body.pagePath, 500),
    page_title: cleanText(body.pageTitle, 300) || null,
    target_url: cleanText(body.targetUrl, 1000) || null,
    target_label: cleanText(body.targetLabel, 200) || null,
    visitor_id: cleanText(body.visitorId, 100),
    session_id: cleanText(body.sessionId, 100),
    referrer: cleanText(body.referrer, 1000) || null,
    device_type: getDeviceType(userAgent, screenWidth),
    browser: getBrowser(userAgent),
    utm_source: cleanText(body.utmSource, 200) || null,
    utm_medium: cleanText(body.utmMedium, 200) || null,
    utm_campaign: cleanText(body.utmCampaign, 200) || null,
  };

  try {
    const response = await supabaseRequest("", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error("Click event insert failed:", response.status);
      return NextResponse.json({ error: "Unable to record event." }, { status: 500 });
    }
  } catch (error) {
    console.error("Click event storage error:", error);
    return NextResponse.json({ error: "Unable to record event." }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
