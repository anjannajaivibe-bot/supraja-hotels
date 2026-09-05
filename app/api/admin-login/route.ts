import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionValue,
} from "@/lib/admin-auth";
import { findHotelAdminUser, verifyStoredPassword } from "@/lib/hotel-ops";

export async function POST(request: NextRequest) {
  let credentials: { username?: string; password?: string };
  try {
    credentials = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = credentials.username?.trim();
  const password = credentials.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const masterUsername = process.env.ADMIN_USERNAME;
  const masterPassword = process.env.ADMIN_PASSWORD;

  let sessionValue: string | null = null;

  if (masterUsername && masterPassword && username === masterUsername && password === masterPassword) {
    sessionValue = createAdminSessionValue({
      username,
      displayName: "Master Admin",
      role: "master",
      hotelId: null,
      hotelName: null,
    });
  } else {
    try {
      const user = await findHotelAdminUser(username);
      if (user?.is_active && verifyStoredPassword(password, user.password_hash)) {
        sessionValue = createAdminSessionValue({
          username: user.username,
          displayName: user.display_name,
          role: "hotel_admin",
          hotelId: user.hotel_id,
          hotelName: user.hotels?.name ?? "Assigned Hotel",
        });
      }
    } catch {
      return NextResponse.json({ error: "Hotel login service is unavailable." }, { status: 503 });
    }
  }

  if (!sessionValue) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, sessionValue, adminCookieOptions);
  return response;
}
