import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "hotel_admin" && session.hotelId) {
    return NextResponse.json({ hotels: [{ id: session.hotelId, name: session.hotelName ?? "Assigned Hotel" }] });
  }

  const response = await supabaseRequest("?select=id,code,name&is_active=eq.true&order=name.asc", {}, "hotels");
  if (!response.ok) return NextResponse.json({ error: "Unable to load hotels." }, { status: 500 });
  return NextResponse.json({ hotels: await response.json() });
}
