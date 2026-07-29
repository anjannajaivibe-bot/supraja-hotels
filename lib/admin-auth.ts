import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "supraja_admin_auth";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be configured with at least 32 characters."
    );
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createAdminSessionValue() {
  const expiresAt = Date.now() + COOKIE_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value) return false;

  const [expiresAt, suppliedSignature] = value.split(".");
  if (!expiresAt || !suppliedSignature) return false;
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) <= Date.now()) {
    return false;
  }

  const expectedSignature = sign(expiresAt);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function isAdminRequest(request: NextRequest) {
  return verifyAdminSessionValue(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value
  );
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
