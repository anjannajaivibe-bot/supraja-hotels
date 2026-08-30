import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const response = await supabaseRequest("?select=id,created_at,name,email,phone,source_page,consent_source,status&order=created_at.desc&limit=2000", {}, "hotel_subscribers");
    if (!response.ok) return NextResponse.json({ error: "Unable to load subscribers." }, { status: 500 });
    return NextResponse.json({ subscribers: await response.json() });
  } catch {
    return NextResponse.json({ error: "Unable to load subscribers." }, { status: 500 });
  }
}
