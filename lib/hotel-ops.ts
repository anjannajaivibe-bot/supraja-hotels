import { scryptSync, timingSafeEqual } from "node:crypto";
import { supabaseRequest } from "@/lib/supabase-rest";
import type { AdminSession } from "@/lib/admin-auth";

export type HotelAdminUser = {
  id: string;
  username: string;
  display_name: string;
  hotel_id: string;
  is_active: boolean;
  password_hash: string;
  hotels?: { name?: string } | null;
};

export function verifyStoredPassword(password: string, stored: string) {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  try {
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function hashPassword(password: string, salt: string) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function findHotelAdminUser(username: string) {
  const query = `?select=id,username,display_name,hotel_id,is_active,password_hash,hotels(name)&username=eq.${encodeURIComponent(username)}&limit=1`;
  const response = await supabaseRequest(query, {}, "hotel_admin_users");
  if (!response.ok) return null;
  const rows = (await response.json()) as HotelAdminUser[];
  return rows[0] ?? null;
}

export function hotelScope(session: AdminSession, requestedHotelId?: string | null) {
  if (session.role === "master") return requestedHotelId || null;
  return session.hotelId;
}

export async function writeAuditLog(session: AdminSession, action: string, entityType: string, entityId: string | null, hotelId: string | null, details: Record<string, unknown> = {}) {
  await supabaseRequest("", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      hotel_id: hotelId,
      username: session.username,
      actor_role: session.role,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    }),
  }, "hotel_operation_audit_log");
}
