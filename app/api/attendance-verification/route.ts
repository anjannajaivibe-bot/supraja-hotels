import { NextResponse, type NextRequest } from "next/server";
import {
  distanceMetres,
  getHotelAttendanceConfig,
  hashAttendanceCode,
} from "@/lib/attendance-verification";
import {
  checkPublicApiRateLimit,
  isBodyWithinLimit,
  isJsonRequest,
  isSameOriginRequest,
  recordPublicApiRequest,
} from "@/lib/public-api-security";
import { supabaseRequest } from "@/lib/supabase-rest";
import { uploadAttendanceSelfie } from "@/lib/supabase-storage";

type Challenge = {
  id: string;
  hotel_id: string;
  subject_type: "employee" | "staff";
  employee_id: string | null;
  staff_member_id: string | null;
  action: "reception_start" | "cleaning_start";
  expires_at: string;
  status: string;
};

async function findPendingChallenge(code: string) {
  const response = await supabaseRequest(
    `?select=id,hotel_id,subject_type,employee_id,staff_member_id,action,expires_at,status&code_hash=eq.${encodeURIComponent(hashAttendanceCode(code))}&status=eq.pending&order=created_at.desc&limit=1`,
    {},
    "hotel_attendance_verifications",
  );
  if (!response.ok) return null;
  const row = ((await response.json()) as Challenge[])[0] ?? null;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await supabaseRequest(
      `?id=eq.${encodeURIComponent(row.id)}&status=eq.pending`,
      { method: "PATCH", body: JSON.stringify({ status: "expired" }) },
      "hotel_attendance_verifications",
    );
    return null;
  }
  return row;
}

async function subjectName(challenge: Challenge) {
  const table = challenge.subject_type === "employee" ? "hotel_employees" : "hotel_staff_members";
  const id = challenge.subject_type === "employee" ? challenge.employee_id : challenge.staff_member_id;
  if (!id) return "Staff member";
  const response = await supabaseRequest(
    `?select=name&id=eq.${encodeURIComponent(id)}&limit=1`,
    {},
    table,
  );
  if (!response.ok) return "Staff member";
  return ((await response.json()) as Array<{ name: string }>)[0]?.name ?? "Staff member";
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isJsonRequest(request)) return NextResponse.json({ error: "JSON request required." }, { status: 415 });
  if (!isBodyWithinLimit(request, 360 * 1024)) return NextResponse.json({ error: "Verification payload is too large." }, { status: 413 });

  const limit = await checkPublicApiRateLimit(request, {
    endpoint: "attendance-verification",
    windowMinutes: 10,
    maxRequests: 30,
  });
  if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  await recordPublicApiRequest("attendance-verification", limit.ipHash);

  const body = (await request.json().catch(() => ({}))) as {
    step?: "lookup" | "verify";
    code?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    deviceId?: string;
    photoData?: string | null;
  };
  const code = body.code?.replace(/\D/g, "").slice(0, 6) ?? "";
  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: "Enter the 6-digit attendance code." }, { status: 400 });

  const challenge = await findPendingChallenge(code);
  if (!challenge) return NextResponse.json({ error: "Code is invalid or expired. Ask the hotel desk for a new code." }, { status: 404 });

  const hotel = await getHotelAttendanceConfig(challenge.hotel_id);
  if (!hotel) return NextResponse.json({ error: "Unable to load hotel verification settings." }, { status: 500 });
  const name = await subjectName(challenge);

  if (body.step === "lookup") {
    return NextResponse.json({
      verification: {
        id: challenge.id,
        subjectName: name,
        hotelName: hotel.name,
        action: challenge.action,
        expiresAt: challenge.expires_at,
      },
    });
  }

  if (body.step !== "verify") return NextResponse.json({ error: "Invalid verification step." }, { status: 400 });

  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const accuracy = Number(body.accuracy);
  if (
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    !Number.isFinite(accuracy) || accuracy <= 0
  ) {
    return NextResponse.json({ error: "A valid live GPS location is required." }, { status: 400 });
  }
  if (hotel.attendance_latitude == null || hotel.attendance_longitude == null) {
    return NextResponse.json({ error: "Hotel attendance location is not configured." }, { status: 409 });
  }
  if (accuracy > 180) {
    return NextResponse.json({ error: "GPS accuracy is too weak. Move near a window or entrance and try again." }, { status: 422 });
  }

  const distance = distanceMetres(
    latitude,
    longitude,
    hotel.attendance_latitude,
    hotel.attendance_longitude,
  );
  const accuracyAllowance = Math.min(accuracy, 75);
  const allowedDistance = hotel.attendance_radius_m + accuracyAllowance;
  if (distance > allowedDistance) {
    return NextResponse.json({
      error: `You appear to be about ${Math.round(distance)} m from ${hotel.name}. Move inside/near the hotel and try again.`,
      distanceM: Math.round(distance),
      allowedDistanceM: Math.round(allowedDistance),
    }, { status: 422 });
  }

  let photoPath: string | null = null;
  let photoCaptured = false;
  let reviewRequired = false;
  const notes: string[] = [];
  const photoData = body.photoData?.trim() || "";

  if (photoData) {
    const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(photoData);
    if (!match) {
      reviewRequired = true;
      notes.push("Live photo payload was invalid.");
    } else {
      const bytes = Buffer.from(match[1], "base64");
      if (bytes.length < 1500 || bytes.length > 240 * 1024) {
        reviewRequired = true;
        notes.push("Live photo size was outside the accepted range.");
      } else {
        const date = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        const path = `${challenge.hotel_id}/${date}/${challenge.id}.jpg`;
        try {
          const uploaded = await uploadAttendanceSelfie(path, bytes);
          if (uploaded.ok) {
            photoPath = path;
            photoCaptured = true;
          } else {
            reviewRequired = true;
            notes.push("Live photo storage failed; GPS was verified.");
          }
        } catch {
          reviewRequired = true;
          notes.push("Live photo storage failed; GPS was verified.");
        }
      }
    }
  } else {
    reviewRequired = true;
    notes.push("GPS verified without a live photo.");
  }

  const deviceId = (body.deviceId ?? "").trim().slice(0, 120) || null;
  if (deviceId) {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const recent = await supabaseRequest(
      `?select=id,employee_id,staff_member_id&device_id=eq.${encodeURIComponent(deviceId)}&verified_at=gte.${encodeURIComponent(cutoff)}&status=in.(verified,consumed)&limit=10`,
      {},
      "hotel_attendance_verifications",
    );
    if (recent.ok) {
      const rows = (await recent.json()) as Array<{ id: string; employee_id: string | null; staff_member_id: string | null }>;
      const currentSubject = challenge.employee_id ?? challenge.staff_member_id;
      if (rows.some(row => (row.employee_id ?? row.staff_member_id) !== currentSubject)) {
        reviewRequired = true;
        notes.push("Same phone/browser verified more than one person within 30 minutes.");
      }
    }
  }

  const update = {
    status: "verified",
    latitude,
    longitude,
    accuracy_m: Math.round(accuracy * 10) / 10,
    distance_m: Math.round(distance * 10) / 10,
    device_id: deviceId,
    photo_path: photoPath,
    photo_captured: photoCaptured,
    review_required: reviewRequired,
    verification_note: notes.length ? notes.join(" ") : null,
    verified_at: new Date().toISOString(),
  };
  const response = await supabaseRequest(
    `?id=eq.${encodeURIComponent(challenge.id)}&status=eq.pending`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(update),
    },
    "hotel_attendance_verifications",
  );
  if (!response.ok) return NextResponse.json({ error: "Unable to save attendance verification." }, { status: 500 });
  const updated = await response.json() as Array<{ id: string }>;
  if (!updated.length) return NextResponse.json({ error: "This code has already been used or expired." }, { status: 409 });

  return NextResponse.json({
    success: true,
    verification: {
      id: challenge.id,
      subjectName: name,
      hotelName: hotel.name,
      distanceM: Math.round(distance),
      gpsAccuracyM: Math.round(accuracy),
      photoCaptured,
      reviewRequired,
    },
  });
}
