import { NextResponse, type NextRequest } from "next/server";
import { cleanText } from "@/lib/click-events";
import {
  checkPublicApiRateLimit,
  isBodyWithinLimit,
  isJsonRequest,
  isSameOriginRequest,
  recordPublicApiRequest,
} from "@/lib/public-api-security";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

const SUBSCRIBER_ENDPOINT = "subscribers";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!isJsonRequest(request) || !isBodyWithinLimit(request, 8 * 1024)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rateLimit = await checkPublicApiRateLimit(request, {
    endpoint: SUBSCRIBER_ENDPOINT,
    windowMinutes: 15,
    maxRequests: 10,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many subscription attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }
  await recordPublicApiRequest(SUBSCRIBER_ENDPOINT, rateLimit.ipHash);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = cleanText(body.email, 254).toLowerCase();
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 20).replace(/[^0-9+]/g, "");
    const sourcePage = cleanText(body.sourcePage, 500) || "/";
    const consentSource = cleanText(body.consentSource, 50) || "footer_form";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const response = await supabaseRequest("?on_conflict=email", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ email, name: name || null, phone: phone || null, source_page: sourcePage, consent_source: consentSource, consented_at: new Date().toISOString(), status: "active" }),
    }, "hotel_subscribers");
    if (!response.ok) return NextResponse.json({ error: "Unable to subscribe." }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to subscribe." }, { status: 500 });
  }
}
