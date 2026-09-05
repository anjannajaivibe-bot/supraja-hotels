import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "supraja_admin_auth";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

export type AdminRole = "master" | "hotel_admin";

export type AdminSession = {
  username: string;
  displayName: string;
  role: AdminRole;
  hotelId: string | null;
  hotelName: string | null;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function encodePayload(payload: AdminSession) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function createAdminSessionValue(input: Omit<AdminSession, "expiresAt">) {
  const payload: AdminSession = {
    ...input,
    expiresAt: Date.now() + COOKIE_MAX_AGE_SECONDS * 1000,
  };
  const encoded = encodePayload(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function getAdminSessionFromValue(value?: string): AdminSession | null {
  if (!value) return null;
  const [encoded, suppliedSignature] = value.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expectedSignature = sign(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSession;
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) return null;
    if (!parsed.username || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminSession(request: NextRequest) {
  return getAdminSessionFromValue(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function isAdminRequest(request: NextRequest) {
  return Boolean(getAdminSession(request));
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
