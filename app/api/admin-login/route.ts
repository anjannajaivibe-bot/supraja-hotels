import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionValue,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let credentials: { username?: string; password?: string };

  try {
    credentials = (await request.json()) as {
      username?: string;
      password?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 }
    );
  }

  if (
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    ADMIN_COOKIE_NAME,
    createAdminSessionValue(),
    adminCookieOptions
  );
  return response;
}
