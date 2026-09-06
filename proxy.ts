import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "supraja_admin_auth";
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_ADMIN_REQUEST_BYTES = 128 * 1024;

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function decodeSessionExpiry(encoded: string) {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(padded)) as { expiresAt?: number };
    return typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;
  } catch {
    return 0;
  }
}

async function hasValidSession(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!value || !secret || secret.length < 32) return false;

  const [encoded, suppliedSignature, ...extra] = value.split(".");
  if (!encoded || !suppliedSignature || extra.length) return false;

  const expiresAt = decodeSessionExpiry(encoded);
  if (!expiresAt || expiresAt <= Date.now()) return false;

  return suppliedSignature === (await sign(encoded, secret));
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function requestBodyWithinLimit(request: NextRequest) {
  const raw = request.headers.get("content-length");
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length >= 0 && length <= MAX_ADMIN_REQUEST_BYTES;
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAdminLogin = pathname === "/api/admin-login";
  const isAdminLogout = pathname === "/api/admin-logout";
  const isUnsafeAdminRequest =
    UNSAFE_METHODS.has(request.method) &&
    (isAdminApi || isAdminLogin || isAdminLogout);

  if (isUnsafeAdminRequest && !isSameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  if (isUnsafeAdminRequest && !requestBodyWithinLimit(request)) {
    return jsonError("Request is too large.", 413);
  }

  const needsSession =
    (isAdminPage && pathname !== "/admin/login") || isAdminApi;
  const validSession = needsSession || pathname === "/admin/login"
    ? await hasValidSession(request)
    : false;

  if (pathname === "/admin/login") {
    if (validSession) {
      return NextResponse.redirect(new URL("/admin/clicks", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminApi && !validSession) {
    return jsonError("Unauthorized", 401);
  }

  if (isAdminPage && !validSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/admin-login",
    "/api/admin-logout",
  ],
};
