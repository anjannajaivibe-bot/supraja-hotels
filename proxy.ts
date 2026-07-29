import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "supraja_admin_auth";

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hasValidSession(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!value || !secret || secret.length < 32) return false;

  const [expiresAt, suppliedSignature] = value.split(".");
  if (!expiresAt || !suppliedSignature || Number(expiresAt) <= Date.now()) {
    return false;
  }

  return suppliedSignature === (await sign(expiresAt, secret));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const validSession = await hasValidSession(request);

  if (pathname === "/admin/login") {
    if (validSession) {
      return NextResponse.redirect(new URL("/admin/clicks", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !validSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
