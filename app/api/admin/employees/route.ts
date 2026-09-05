import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hashPassword, verifyStoredPassword, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const response = await supabaseRequest(
    "?select=id,name,designation,is_active,created_at,updated_at&order=name.asc",
    {},
    "hotel_employees"
  );
  if (!response.ok) return NextResponse.json({ error: "Unable to load employees." }, { status: 500 });
  return NextResponse.json({ employees: await response.json() });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.role !== "master") return NextResponse.json({ error: "Master Admin access required." }, { status: 403 });

  const body = await request.json().catch(() => ({})) as { name?: string; designation?: string; pin?: string };
  const name = body.name?.trim();
  const designation = body.designation?.trim() || "Manager / Receptionist";
  const pin = body.pin?.trim() || "";

  if (!name || name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter a valid employee name." }, { status: 400 });
  if (!/^\d{4,6}$/.test(pin)) return NextResponse.json({ error: "Employee PIN must be 4 to 6 digits." }, { status: 400 });

  const duplicate = await supabaseRequest(`?select=id&name=ilike.${encodeURIComponent(name)}&limit=1`, {}, "hotel_employees");
  if (!duplicate.ok) return NextResponse.json({ error: "Unable to verify employee." }, { status: 500 });
  if ((await duplicate.json() as Array<{id:string}>).length) return NextResponse.json({ error: "An employee with this name already exists." }, { status: 409 });

  const pinHash = hashPassword(pin, randomBytes(16).toString("hex"));
  const response = await supabaseRequest("", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name, designation, pin_hash: pinHash, is_active: true }),
  }, "hotel_employees");
  if (!response.ok) return NextResponse.json({ error: "Unable to create employee." }, { status: 500 });
  const row = (await response.json() as Array<{id:string}>)[0];
  await writeAuditLog(session, "employee_created", "hotel_employee", row?.id ?? null, null, { name, designation });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { id?: string; action?: "toggle_active" | "reset_pin" | "verify_pin"; isActive?: boolean; pin?: string };
  if (!body.id || !body.action) return NextResponse.json({ error: "Employee and action are required." }, { status: 400 });

  const existingRes = await supabaseRequest(`?select=id,name,pin_hash,is_active&id=eq.${encodeURIComponent(body.id)}&limit=1`, {}, "hotel_employees");
  if (!existingRes.ok) return NextResponse.json({ error: "Unable to verify employee." }, { status: 500 });
  const employee = (await existingRes.json() as Array<{id:string;name:string;pin_hash:string;is_active:boolean}>)[0];
  if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

  if (body.action === "verify_pin") {
    if (!employee.is_active) return NextResponse.json({ error: "Employee is inactive." }, { status: 409 });
    const pin = body.pin?.trim() || "";
    if (!verifyStoredPassword(pin, employee.pin_hash)) return NextResponse.json({ error: "Incorrect employee PIN." }, { status: 401 });
    return NextResponse.json({ success: true, employee: { id: employee.id, name: employee.name } });
  }

  if (session.role !== "master") return NextResponse.json({ error: "Master Admin access required." }, { status: 403 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.action === "toggle_active") {
    if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "New status is required." }, { status: 400 });
    update.is_active = body.isActive;
  } else {
    const pin = body.pin?.trim() || "";
    if (!/^\d{4,6}$/.test(pin)) return NextResponse.json({ error: "Employee PIN must be 4 to 6 digits." }, { status: 400 });
    update.pin_hash = hashPassword(pin, randomBytes(16).toString("hex"));
  }

  const response = await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(update),
  }, "hotel_employees");
  if (!response.ok) return NextResponse.json({ error: "Unable to update employee." }, { status: 500 });

  await writeAuditLog(session, body.action, "hotel_employee", body.id, null, { employeeName: employee.name, isActive: body.isActive });
  return NextResponse.json({ success: true });
}
