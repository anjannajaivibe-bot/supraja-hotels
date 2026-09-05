import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession, type AdminSession } from "@/lib/admin-auth";
import { hashPassword, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function getMasterSession(request: NextRequest): AdminSession | null {
  const session = getAdminSession(request);
  return session?.role === "master" ? session : null;
}

function unauthorized(request: NextRequest) {
  const session = getAdminSession(request);
  return NextResponse.json({ error: session ? "Master Admin access required." : "Unauthorized." }, { status: session ? 403 : 401 });
}

export async function GET(request: NextRequest) {
  const session = getMasterSession(request);
  if (!session) return unauthorized(request);
  const response = await supabaseRequest("?select=id,username,display_name,hotel_id,is_active,created_at,updated_at,hotels(name,code)&order=created_at.desc", {}, "hotel_admin_users");
  if (!response.ok) return NextResponse.json({ error: "Unable to load hotel logins." }, { status: 500 });
  return NextResponse.json({ users: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getMasterSession(request);
  if (!session) return unauthorized(request);

  const body = await request.json().catch(() => ({})) as { username?: string; password?: string; hotelId?: string };
  const username = body.username?.trim().toLowerCase();
  const password = body.password ?? "";
  const hotelId = body.hotelId?.trim();

  if (!username || !/^[a-z0-9._-]{3,40}$/.test(username)) return NextResponse.json({ error: "Username must be 3-40 characters using letters, numbers, dot, dash or underscore." }, { status: 400 });
  if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (!hotelId) return NextResponse.json({ error: "Select a hotel." }, { status: 400 });
  if (username === process.env.ADMIN_USERNAME?.trim().toLowerCase()) return NextResponse.json({ error: "This username is reserved for Master Admin." }, { status: 409 });

  const hotelRes = await supabaseRequest(`?select=id,name,code&id=eq.${encodeURIComponent(hotelId)}&is_active=eq.true&limit=1`, {}, "hotels");
  if (!hotelRes.ok) return NextResponse.json({ error: "Unable to verify hotel." }, { status: 500 });
  const hotel = (await hotelRes.json() as Array<{id:string;name:string;code:string}>)[0];
  if (!hotel) return NextResponse.json({ error: "Selected hotel is unavailable." }, { status: 400 });

  const existingHotelRes = await supabaseRequest(`?select=id&hotel_id=eq.${encodeURIComponent(hotelId)}&limit=1`, {}, "hotel_admin_users");
  if (!existingHotelRes.ok) return NextResponse.json({ error: "Unable to verify hotel login." }, { status: 500 });
  if ((await existingHotelRes.json() as Array<{id:string}>).length) return NextResponse.json({ error: "This hotel already has a login. Use password reset instead of creating another." }, { status: 409 });

  const passwordHash = hashPassword(password, randomBytes(16).toString("hex"));
  const response = await supabaseRequest("", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ username, display_name: hotel.name, password_hash: passwordHash, hotel_id: hotelId, is_active: true }),
  }, "hotel_admin_users");

  if (!response.ok) {
    const text = await response.text();
    if (text.toLowerCase().includes("duplicate")) return NextResponse.json({ error: "That username or hotel login already exists." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create hotel login." }, { status: 500 });
  }

  const row = (await response.json() as Array<{id:string}>)[0];
  await writeAuditLog(session, "hotel_login_created", "hotel_admin_user", row?.id ?? null, hotelId, { username, hotelName: hotel.name });
  return NextResponse.json({ success: true, id: row?.id ?? null });
}

export async function PATCH(request: NextRequest) {
  const session = getMasterSession(request);
  if (!session) return unauthorized(request);
  const body = await request.json().catch(() => ({})) as { id?: string; action?: "toggle_active" | "reset_password"; isActive?: boolean; password?: string };
  if (!body.id || !body.action) return NextResponse.json({ error: "Login and action are required." }, { status: 400 });

  const existingRes = await supabaseRequest(`?select=id,username,hotel_id,is_active&id=eq.${encodeURIComponent(body.id)}&limit=1`, {}, "hotel_admin_users");
  if (!existingRes.ok) return NextResponse.json({ error: "Unable to verify hotel login." }, { status: 500 });
  const existing = (await existingRes.json() as Array<{id:string;username:string;hotel_id:string;is_active:boolean}>)[0];
  if (!existing) return NextResponse.json({ error: "Hotel login not found." }, { status: 404 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.action === "toggle_active") {
    if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "New status is required." }, { status: 400 });
    update.is_active = body.isActive;
  } else {
    const password = body.password ?? "";
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    update.password_hash = hashPassword(password, randomBytes(16).toString("hex"));
  }

  const updateRes = await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(update) }, "hotel_admin_users");
  if (!updateRes.ok) return NextResponse.json({ error: "Unable to update hotel login." }, { status: 500 });

  await writeAuditLog(session, body.action, "hotel_admin_user", body.id, existing.hotel_id, { username: existing.username, isActive: body.action === "toggle_active" ? body.isActive : undefined });
  return NextResponse.json({ success: true });
}
