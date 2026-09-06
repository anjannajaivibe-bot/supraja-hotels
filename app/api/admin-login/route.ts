import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionValue,
} from "@/lib/admin-auth";
import { isMobileOrTabletUserAgent } from "@/lib/admin-device-access";
import {
  checkAdminLoginRateLimit,
  recordAdminLoginAttempt,
} from "@/lib/admin-login-security";
import { findHotelAdminUser, verifyStoredPassword } from "@/lib/hotel-ops";

function safeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

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
  if (username.length > 80 || password.length > 256) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const rateLimit = await checkAdminLoginRateLimit(request, username);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many unsuccessful login attempts. Please wait 15 minutes and try again." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  const masterUsername = process.env.ADMIN_USERNAME;
  const masterPassword = process.env.ADMIN_PASSWORD;

  let sessionValue: string | null = null;

  if (
    masterUsername &&
    masterPassword &&
    safeStringEqual(username, masterUsername) &&
    safeStringEqual(password, masterPassword)
  ) {
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
        if (isMobileOrTabletUserAgent(request.headers.get("user-agent"))) {
          await recordAdminLoginAttempt(username, true, rateLimit.ipHash);
          return NextResponse.json(
            { error: "Hotel admin access is allowed only from a desktop or laptop computer." },
            { status: 403 },
          );
        }
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
    await recordAdminLoginAttempt(username, false, rateLimit.ipHash);
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  await recordAdminLoginAttempt(username, true, rateLimit.ipHash);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, sessionValue, adminCookieOptions);
  return response;
}
