import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

type RateLimitOptions = {
  endpoint: string;
  windowMinutes: number;
  maxRequests: number;
};

function getHashSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function hashIdentifier(value: string) {
  return createHmac("sha256", getHashSecret()).update(value).digest("hex");
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export function isJsonRequest(request: NextRequest) {
  return (request.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith("application/json");
}

export function isBodyWithinLimit(request: NextRequest, maxBytes: number) {
  const raw = request.headers.get("content-length");
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}

export async function checkPublicApiRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
) {
  try {
    const clientIp = getClientIp(request);
    if (clientIp === "unknown") return { allowed: true, ipHash: null as string | null };

    const ipHash = hashIdentifier(clientIp);
    const cutoff = new Date(
      Date.now() - options.windowMinutes * 60 * 1000,
    ).toISOString();
    const query = `?select=id&endpoint=eq.${encodeURIComponent(options.endpoint)}&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(cutoff)}&limit=${options.maxRequests}`;
    const response = await supabaseRequest(query, {}, "hotel_public_api_requests");
    if (!response.ok) throw new Error("Unable to read public API request counts.");

    const rows = (await response.json()) as Array<{ id: number }>;
    return { allowed: rows.length < options.maxRequests, ipHash };
  } catch {
    // Rate limiting is defensive. It must not take the public website offline.
    return { allowed: true, ipHash: null as string | null };
  }
}

export async function recordPublicApiRequest(
  endpoint: string,
  ipHash: string | null,
) {
  if (!ipHash) return;

  try {
    await supabaseRequest(
      "",
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ endpoint, ip_hash: ipHash }),
      },
      "hotel_public_api_requests",
    );
  } catch {
    // Logging must never make a legitimate website request fail.
  }
}
