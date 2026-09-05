import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { isMobileOrTabletUserAgent } from "@/lib/admin-device-access";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role === "hotel_admin" && isMobileOrTabletUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json(
      { error: "Hotel admin access is allowed only from a desktop or laptop computer.", deviceBlocked: true },
      { status: 403 },
    );
  }
  return NextResponse.json({ session });
}
