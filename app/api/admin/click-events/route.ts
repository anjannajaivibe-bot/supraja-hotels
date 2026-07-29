import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import type { StoredClickEvent } from "@/lib/click-events";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedDays = Number(url.searchParams.get("days") ?? "30");
  const days = [1, 7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const eventType = url.searchParams.get("eventType") ?? "all";
  const page = url.searchParams.get("page")?.trim() ?? "";
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const filters = new URLSearchParams({
    select:
      "id,created_at,event_type,page_path,page_title,target_url,target_label,visitor_id,session_id,referrer,device_type,browser,utm_source,utm_medium,utm_campaign",
    created_at: `gte.${since}`,
    order: "created_at.desc",
    limit: "1000",
  });

  if (eventType !== "all") filters.set("event_type", `eq.${eventType}`);
  if (page) filters.set("page_path", `ilike.*${page.replace(/[%*,]/g, "")}*`);

  try {
    const response = await supabaseRequest(`?${filters.toString()}`);

    if (!response.ok) {
      console.error("Click event query failed:", response.status);
      return NextResponse.json({ error: "Unable to load events." }, { status: 500 });
    }

    const events = (await response.json()) as StoredClickEvent[];
    return NextResponse.json({ events, days });
  } catch (error) {
    console.error("Click event query error:", error);
    return NextResponse.json({ error: "Unable to load events." }, { status: 500 });
  }
}
