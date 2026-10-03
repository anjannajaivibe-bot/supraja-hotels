import { createHmac } from "node:crypto";
import { supabaseRequest } from "@/lib/supabase-rest";

export type AttendanceSubjectType = "employee" | "staff";
export type AttendanceVerificationAction = "reception_start" | "cleaning_start";

type HotelAttendanceConfig = {
  id: string;
  name: string;
  attendance_latitude: number | null;
  attendance_longitude: number | null;
  attendance_radius_m: number;
  attendance_verification_mode: "off" | "observe" | "enforce";
};

function verificationSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function hashAttendanceCode(code: string) {
  return createHmac("sha256", verificationSecret()).update(code.trim()).digest("hex");
}

export function distanceMetres(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => value * Math.PI / 180;
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getHotelAttendanceConfig(hotelId: string) {
  const response = await supabaseRequest(
    `?select=id,name,attendance_latitude,attendance_longitude,attendance_radius_m,attendance_verification_mode&id=eq.${encodeURIComponent(hotelId)}&limit=1`,
    {},
    "hotels",
  );
  if (!response.ok) return null;
  return ((await response.json()) as HotelAttendanceConfig[])[0] ?? null;
}

export async function validateAttendanceVerification(input: {
  hotelId: string;
  verificationId?: string | null;
  subjectType: AttendanceSubjectType;
  subjectId: string;
  action: AttendanceVerificationAction;
}) {
  const hotel = await getHotelAttendanceConfig(input.hotelId);
  if (!hotel) return { ok: false as const, error: "Unable to load hotel attendance settings." };

  const required = hotel.attendance_verification_mode === "enforce";
  if (!input.verificationId) {
    if (required) {
      return {
        ok: false as const,
        required: true,
        error: "Physical presence verification is required before starting this shift.",
      };
    }
    return { ok: true as const, required: false, verificationId: null, reviewRequired: false };
  }

  const response = await supabaseRequest(
    `?select=id,hotel_id,subject_type,employee_id,staff_member_id,action,status,verified_at,consumed_at,review_required&id=eq.${encodeURIComponent(input.verificationId)}&limit=1`,
    {},
    "hotel_attendance_verifications",
  );
  if (!response.ok) return { ok: false as const, error: "Unable to verify physical presence." };

  const row = ((await response.json()) as Array<{
    id: string;
    hotel_id: string;
    subject_type: AttendanceSubjectType;
    employee_id: string | null;
    staff_member_id: string | null;
    action: AttendanceVerificationAction;
    status: string;
    verified_at: string | null;
    consumed_at: string | null;
    review_required: boolean;
  }>)[0];

  const rowSubjectId = row?.subject_type === "employee" ? row.employee_id : row?.staff_member_id;
  if (
    !row ||
    row.hotel_id !== input.hotelId ||
    row.subject_type !== input.subjectType ||
    rowSubjectId !== input.subjectId ||
    row.action !== input.action
  ) {
    return { ok: false as const, error: "Attendance verification does not match this employee or shift." };
  }
  if (row.status !== "verified" || row.consumed_at) {
    return { ok: false as const, error: "Attendance verification is not ready or has already been used." };
  }
  if (!row.verified_at || Date.now() - new Date(row.verified_at).getTime() > 10 * 60 * 1000) {
    return { ok: false as const, error: "Attendance verification has expired. Generate a new code." };
  }

  return {
    ok: true as const,
    required,
    verificationId: row.id,
    reviewRequired: row.review_required,
  };
}

export async function consumeAttendanceVerification(id?: string | null) {
  if (!id) return;
  await supabaseRequest(
    `?id=eq.${encodeURIComponent(id)}&status=eq.verified`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "consumed", consumed_at: new Date().toISOString() }),
    },
    "hotel_attendance_verifications",
  );
}
