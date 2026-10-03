import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";
import { downloadAttendanceSelfie } from "@/lib/supabase-storage";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Verification ID is required." }, { status: 400 });

  const response = await supabaseRequest(
    `?select=id,hotel_id,photo_path&id=eq.${encodeURIComponent(id)}&limit=1`,
    {},
    "hotel_attendance_verifications",
  );
  if (!response.ok) return NextResponse.json({ error: "Unable to load verification photo." }, { status: 500 });
  const row = ((await response.json()) as Array<{ id: string; hotel_id: string; photo_path: string | null }>)[0];
  if (!row?.photo_path) return NextResponse.json({ error: "No live photo is available." }, { status: 404 });

  const scopedHotel = hotelScope(session, row.hotel_id);
  if (session.role !== "master" && scopedHotel !== row.hotel_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const photo = await downloadAttendanceSelfie(row.photo_path);
  if (!photo.ok) return NextResponse.json({ error: "Unable to load verification photo." }, { status: 502 });
  return new NextResponse(await photo.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": photo.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": "inline",
    },
  });
}
