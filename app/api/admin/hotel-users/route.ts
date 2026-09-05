import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hashPassword, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function requireMaster(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  if (session.role !== "master") return { error: NextResponse.json({ error: "Master Admin access required." }, { status: 403 }) };
  return { session };
}

export async function GET(request: NextRequest) {
  const auth = requireMaster(request);
  if (auth.error) return auth.error;

  const response = await supabaseRequest(
    "?select=id,username,display_name,hotel_id,is_active,created_at,updated_at,hotels(name,code)&order=created_at.desc",
    {},
    "hotel_admin_users"
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to load hotel users." }, { status: 500 });
  }

  return NextResponse.json({ users: await response.json() });
}

export async function POST(request: NextRequest) {
  const auth = requireMaster(request);
  if (auth.error) return auth.error;
  const session = auth.session;

  let body: { username?: string; displayName?: string; password?: string; hotelId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const displayName = body.displayName?.trim();
  const password = body.password ?? "";
  const hotelId = body.hotelId?.trim();

  if (!username || !/^[a-z0-9._-]{3,40}$/.test(username)) {
    return NextResponse.json({ error: "Username must be 3-40 characters using letters, numbers, dot, dash or underscore." }, { status: 400 });
  }
  if (!displayName || displayName.length < 2 || displayName.length > 80) {
    return NextResponse.json({ error: "Enter a valid employee display name." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!hotelId) {
    return NextResponse.json({ error: "Select a hotel." }, { status: 400 });
  }
  if (username === process.env.ADMIN_USERNAME?.trim().toLowerCase()) {
    return NextResponse.json({ error: "This username is reserved for Master Admin." }, { status: 409 });
  }

  const passwordHash = hashPassword(password, randomBytes(16).toString("hex"));
  const response = await supabaseRequest("", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ username, display_name: displayName, password_hash: passwordHash, hotel_id: hotelId, is_active: true }),
  }, "hotel_admin_users");

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("hotel_admin_users_username_key")) {
      return NextResponse.json({ error: "That username already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create hotel user." }, { status: 500 });
  }

  const rows = await response.json() as Array<{ id: string }>;
  const userId = rows[0]?.id ?? null;
  await writeAuditLog(session, "create", "hotel_admin_user", userId, hotelId, { username, displayName });
  return NextResponse.json({ success: true, id: userId });
}

export async function PATCH(request: NextRequest) {
  const auth = requireMaster(request);
  if (auth.error) return auth.error;
  const session = auth.session;

  let body: { id?: string; action?: "toggle_active" | "reset_password"; isActive?: boolean; password?: string; hotelId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "User and action are required." }, { status: 400 });
  }

  const existingRes = await supabaseRequest(`?select=id,username,hotel_id,is_active&id=eq.${encodeURIComponent(body.id)}&limit=1`, {}, "hotel_admin_users");
  if (!existingRes.ok) return NextResponse.json({ error: "Unable to verify hotel user." }, { status: 500 });
  const existing = (await existingRes.json() as Array<{ id:string; username:string; hotel_id:string; is_active:boolean }>)[0];
  if (!existing) return NextResponse.json({ error: "Hotel user not found." }, { status: 404 });

  let update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.action === "toggle_active") {
    if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "New status is required." }, { status: 400 });
    update.is_active = body.isActive;
  } else {
    const password = body.password ?? "";
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    update.password_hash = hashPassword(password, randomBytes(16).toString("hex"));
  }

  const updateRes = await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(update),
  }, "hotel_admin_users");

  if (!updateRes.ok) return NextResponse.json({ error: "Unable to update hotel user." }, { status: 500 });

  await writeAuditLog(session, body.action, "hotel_admin_user", body.id, existing.hotel_id, {
    username: existing.username,
    isActive: body.action === "toggle_active" ? body.isActive : undefined,
  });

  return NextResponse.json({ success: true });
}
