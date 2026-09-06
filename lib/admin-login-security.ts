import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

const WINDOW_MINUTES = 15;
const MAX_FAILURES_PER_IP_AND_USERNAME = 8;
const MAX_FAILURES_PER_IP = 25;

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
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

async function countRecentFailures(ipHash: string, username?: string) {
  const cutoff = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
  const usernameFilter = username ? `&username=eq.${encodeURIComponent(username)}` : "";
  const query = `?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}${usernameFilter}&success=eq.false&attempted_at=gte.${encodeURIComponent(cutoff)}&limit=${MAX_FAILURES_PER_IP}`;
  const response = await supabaseRequest(query, {}, "hotel_admin_login_attempts");
  if (!response.ok) throw new Error("Unable to read login attempts.");
  const rows = (await response.json()) as Array<{ id: number }>;
  return rows.length;
}

export async function checkAdminLoginRateLimit(request: NextRequest, username: string) {
  try {
    const clientIp = getClientIp(request);
    const ipHash = hashIdentifier(clientIp);

    const [pairFailures, ipFailures] = await Promise.all([
      countRecentFailures(ipHash, username),
      clientIp === "unknown" ? Promise.resolve(0) : countRecentFailures(ipHash),
    ]);

    return {
      allowed:
        pairFailures < MAX_FAILURES_PER_IP_AND_USERNAME &&
        ipFailures < MAX_FAILURES_PER_IP,
      ipHash,
    };
  } catch {
    // Fail open if the throttling store is unavailable so legitimate hotel access is not blocked.
    return { allowed: true, ipHash: null as string | null };
  }
}

export async function recordAdminLoginAttempt(
  username: string,
  success: boolean,
  ipHash: string | null,
) {
  if (!ipHash) return;

  try {
    await supabaseRequest(
      "",
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          ip_hash: ipHash,
          username,
          success,
        }),
      },
      "hotel_admin_login_attempts",
    );
  } catch {
    // Audit/throttling writes must never prevent a valid login.
  }
}
