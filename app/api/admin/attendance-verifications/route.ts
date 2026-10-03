import { randomInt } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  type AttendanceSubjectType,
  type AttendanceVerificationAction,
  getHotelAttendanceConfig,
  hashAttendanceCode,
} from "@/lib/attendance-verification";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

type Body = {
  subjectType?: AttendanceSubjectType;
  subjectId?: string;
  action?: AttendanceVerificationAction;
};

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Verification ID is required." }, { status: 400 });

  const response = await supabaseRequest(
    `?select=id,hotel_id,status,expires_at,verified_at,review_required,photo_captured,distance_m,accuracy_m&id=eq.${encodeURIComponent(id)}&limit=1`,
    {},
    "hotel_attendance_verifications",
  );
  if (!response.ok) return NextResponse.json({ error: "Unable to load attendance verification." }, { status: 500 });
  const row = ((await response.json()) as Array<Record<string, unknown>>)[0] as {
    id: string;
    hotel_id: string;
    status: string;
    expires_at: string;
    verified_at: string | null;
    review_required: boolean;
    photo_captured: boolean;
    distance_m: number | null;
    accuracy_m: number | null;
  } | undefined;
  if (!row) return NextResponse.json({ error: "Attendance verification not found." }, { status: 404 });

  const scopedHotel = hotelScope(session, row.hotel_id);
  if (session.role !== "master" && scopedHotel !== row.hotel_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let status = row.status;
  if (status === "pending" && new Date(row.expires_at).getTime() <= Date.now()) {
    status = "expired";
    await supabaseRequest(
      `?id=eq.${encodeURIComponent(row.id)}&status=eq.pending`,
      { method: "PATCH", body: JSON.stringify({ status: "expired" }) },
      "hotel_attendance_verifications",
    );
  }

  return NextResponse.json({ verification: { ...row, status } });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "hotel_admin" || !session.hotelId) {
    return NextResponse.json({ error: "Hotel login required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  if (body.subjectType !== "employee" || !body.subjectId || body.action !== "reception_start") {
    return NextResponse.json({ error: "Presence verification is available only for reception/manager shift start." }, { status: 400 });
  }

  const hotel = await getHotelAttendanceConfig(session.hotelId);
  if (!hotel) return NextResponse.json({ error: "Unable to load hotel attendance settings." }, { status: 500 });
  if (
    hotel.attendance_verification_mode === "enforce" &&
    (hotel.attendance_latitude == null || hotel.attendance_longitude == null)
  ) {
    return NextResponse.json({ error: "Hotel attendance location is not configured. Contact Master Admin." }, { status: 409 });
  }

  const employeeResponse = await supabaseRequest(
    `?select=id,name,is_active&id=eq.${encodeURIComponent(body.subjectId)}&limit=1`,
    {},
    "hotel_employees",
  );
  if (!employeeResponse.ok) return NextResponse.json({ error: "Unable to verify employee." }, { status: 500 });
  const employee = ((await employeeResponse.json()) as Array<{ id: string; name: string; is_active: boolean }>)[0];
  if (!employee || !employee.is_active) return NextResponse.json({ error: "Employee is unavailable." }, { status: 409 });
  const subjectName = employee.name;

  const subjectColumn = "employee_id";
  await supabaseRequest(
    `?hotel_id=eq.${encodeURIComponent(session.hotelId)}&${subjectColumn}=eq.${encodeURIComponent(body.subjectId)}&action=eq.${body.action}&status=eq.pending`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "cancelled" }),
    },
    "hotel_attendance_verifications",
  );

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();
  const payload = {
    hotel_id: session.hotelId,
    subject_type: "employee",
    employee_id: body.subjectId,
    staff_member_id: null,
    action: "reception_start",
    code_hash: hashAttendanceCode(code),
    expires_at: expiresAt,
    created_by: session.username,
  };

  const response = await supabaseRequest(
    "?select=id,status,expires_at",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
    "hotel_attendance_verifications",
  );
  if (!response.ok) return NextResponse.json({ error: "Unable to create attendance verification." }, { status: 500 });
  const row = ((await response.json()) as Array<{ id: string; status: string; expires_at: string }>)[0];

  await writeAuditLog(session, "attendance_verification_created", "attendance_verification", row.id, session.hotelId, {
    subjectType: "employee",
    subjectId: body.subjectId,
    subjectName,
    action: "reception_start",
    expiresAt,
  });

  return NextResponse.json({
    verification: {
      id: row.id,
      code,
      status: row.status,
      expiresAt: row.expires_at,
      subjectName,
      hotelName: hotel.name,
    },
  });
}
