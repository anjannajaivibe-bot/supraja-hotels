import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { isMobileOrTabletUserAgent } from "@/lib/admin-device-access";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

type DayUseRow = {
  id: string;
  hotel_id: string;
  room_id: string;
  room_no: string;
  booking_id: string;
  guest_name: string;
  phone: string;
  aadhaar_no: string;
  stay_hours: number;
  price: number | string;
  checked_in_at: string;
  checked_out_at: string | null;
  status: "checked_in" | "checked_out";
  created_by: string;
  created_by_employee_name: string | null;
  checked_out_by: string | null;
};

function maskAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 ? `********${digits.slice(-4)}` : "************";
}

function clientRow(row: DayUseRow) {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    roomId: row.room_id,
    roomNo: row.room_no,
    bookingId: row.booking_id,
    name: row.guest_name,
    phone: row.phone,
    aadhaarMasked: maskAadhaar(row.aadhaar_no),
    stayHours: row.stay_hours,
    price: Number(row.price),
    checkedInAt: row.checked_in_at,
    checkedOutAt: row.checked_out_at,
    status: row.status,
    createdBy: row.created_by,
    employeeName: row.created_by_employee_name,
    checkedOutBy: row.checked_out_by,
  };
}

function dateBoundary(date: string, end = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!end) return `${date}T00:00:00+05:30`;
  const d = new Date(`${date}T00:00:00+05:30`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString();
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.role === "hotel_admin" && isMobileOrTabletUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ error: "Hotel admin access is allowed only from a desktop or laptop computer." }, { status: 403 });
  }

  const requestedHotelId = request.nextUrl.searchParams.get("hotelId");
  const allHotels = session.role === "master" && (!requestedHotelId || requestedHotelId === "all");
  const hotelId = allHotels ? null : hotelScope(session, requestedHotelId);
  if (!allHotels && !hotelId) return NextResponse.json({ error: "Hotel required." }, { status: 400 });

  const status = request.nextUrl.searchParams.get("status") || "all";
  if (!["all", "checked_in", "checked_out"].includes(status)) {
    return NextResponse.json({ error: "Invalid status filter." }, { status: 400 });
  }

  const parts = [
    "?select=id,hotel_id,room_id,room_no,booking_id,guest_name,phone,aadhaar_no,stay_hours,price,checked_in_at,checked_out_at,status,created_by,created_by_employee_name,checked_out_by",
  ];
  if (hotelId) parts.push(`&hotel_id=eq.${encodeURIComponent(hotelId)}`);

  if (status !== "all") parts.push(`&status=eq.${status}`);

  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  if (from) {
    const value = dateBoundary(from);
    if (!value) return NextResponse.json({ error: "Invalid from date." }, { status: 400 });
    parts.push(`&checked_in_at=gte.${encodeURIComponent(value)}`);
  }
  if (to) {
    const value = dateBoundary(to, true);
    if (!value) return NextResponse.json({ error: "Invalid to date." }, { status: 400 });
    parts.push(`&checked_in_at=lt.${encodeURIComponent(value)}`);
  }

  parts.push("&order=checked_in_at.desc&limit=500");

  const response = await supabaseRequest(parts.join(""), {}, "hotel_day_use_guests");
  if (!response.ok) {
    return NextResponse.json({ error: "Unable to load day-use guest records." }, { status: 500 });
  }

  const rows = (await response.json()) as DayUseRow[];
  return NextResponse.json({ records: rows.map(clientRow) });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.role === "hotel_admin" && isMobileOrTabletUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ error: "Hotel admin access is allowed only from a desktop or laptop computer." }, { status: 403 });
  }
  if (session.role !== "hotel_admin" || !session.hotelId) {
    return NextResponse.json({ error: "Hotel login required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: string;
    name?: string;
    phone?: string;
    roomId?: string;
    aadhaarNo?: string;
    stayHours?: number | string;
    price?: number | string;
  };

  const bookingId = body.bookingId?.replace(/\s+/g, " ").trim() || "";
  const name = body.name?.replace(/\s+/g, " ").trim() || "";
  const phone = String(body.phone || "").replace(/\D/g, "");
  const aadhaarNo = String(body.aadhaarNo || "").replace(/\D/g, "");
  const roomId = String(body.roomId || "").trim();
  const stayHours = Number(body.stayHours);
  const price = Number(body.price);

  if (!bookingId) {
    console.warn("[day-use] Check-in rejected because the client page did not send a booking ID.");
    return NextResponse.json(
      {
        code: "PAGE_REFRESH_REQUIRED",
        error: "This Day Use Guests page was updated. Refresh the page once, enter Booking ID, and check in again.",
      },
      { status: 409 },
    );
  }
  if (bookingId.length < 2 || bookingId.length > 60) {
    return NextResponse.json({ error: "Booking ID must be between 2 and 60 characters." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Enter a valid guest name." }, { status: 400 });
  }
  if (!/^\d{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }
  if (!/^\d{12}$/.test(aadhaarNo)) {
    return NextResponse.json({ error: "Aadhaar number must contain exactly 12 digits." }, { status: 400 });
  }
  if (!roomId) {
    console.warn("[day-use] Check-in rejected because the client page did not send a room assignment.");
    return NextResponse.json(
      {
        code: "PAGE_REFRESH_REQUIRED",
        error: "This Day Use Guests page was updated. Refresh the page once, select Room Number Assigned, and check in again.",
      },
      { status: 409 },
    );
  }
  if (!Number.isInteger(stayHours) || stayHours < 1 || stayHours > 24) {
    return NextResponse.json({ error: "Stay hours must be between 1 and 24." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0 || price > 100000) {
    return NextResponse.json({ error: "Enter a valid price." }, { status: 400 });
  }

  const roomRes = await supabaseRequest(
    `?select=id,room_no,status&hotel_id=eq.${encodeURIComponent(session.hotelId)}&id=eq.${encodeURIComponent(roomId)}&is_active=eq.true&limit=1`,
    {},
    "hotel_rooms",
  );
  if (!roomRes.ok) {
    return NextResponse.json({ error: "Unable to validate the assigned room." }, { status: 500 });
  }
  const roomRows = (await roomRes.json()) as { id: string; room_no: string; status: string }[];
  const room = roomRows[0];
  if (!room) {
    return NextResponse.json({ error: "Select a valid room assigned to this hotel." }, { status: 400 });
  }

  const activeRoomRes = await supabaseRequest(
    `?select=id&hotel_id=eq.${encodeURIComponent(session.hotelId)}&room_id=eq.${encodeURIComponent(roomId)}&status=eq.checked_in&limit=1`,
    {},
    "hotel_day_use_guests",
  );
  if (activeRoomRes.ok) {
    const activeRows = (await activeRoomRes.json()) as { id: string }[];
    if (activeRows.length) {
      return NextResponse.json({ error: `Room ${room.room_no} already has an active day-use guest.` }, { status: 409 });
    }
  }

  let shiftId: string | null = null;
  let employeeName: string | null = null;
  const shiftRes = await supabaseRequest(
    `?select=id,display_name&hotel_id=eq.${encodeURIComponent(session.hotelId)}&status=eq.active&order=started_at.desc&limit=1`,
    {},
    "hotel_shifts",
  );
  if (shiftRes.ok) {
    const shifts = (await shiftRes.json()) as { id: string; display_name: string }[];
    shiftId = shifts[0]?.id ?? null;
    employeeName = shifts[0]?.display_name ?? null;
  }

  const response = await supabaseRequest(
    "",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        hotel_id: session.hotelId,
        shift_id: shiftId,
        room_id: room.id,
        room_no: room.room_no,
        booking_id: bookingId,
        guest_name: name,
        phone,
        aadhaar_no: aadhaarNo,
        stay_hours: stayHours,
        price,
        created_by: session.username,
        created_by_employee_name: employeeName,
      }),
    },
    "hotel_day_use_guests",
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes("hotel_day_use_guests_active_room_unique")) {
      return NextResponse.json({ error: `Room ${room.room_no} already has an active day-use guest.` }, { status: 409 });
    }
    if (errorText.includes("hotel_day_use_guests_hotel_booking_id_unique")) {
      return NextResponse.json({ error: "This Booking ID is already used for this hotel." }, { status: 409 });
    }
    let databaseCode = "unknown";
    try {
      databaseCode = String((JSON.parse(errorText) as { code?: string }).code || "unknown");
    } catch {}
    console.error("[day-use] Database check-in failed.", { status: response.status, code: databaseCode });
    return NextResponse.json({ error: "Unable to check in day-use guest. Please retry once." }, { status: 500 });
  }

  const row = ((await response.json()) as DayUseRow[])[0];
  await writeAuditLog(
    session,
    "day_use_guest_checked_in",
    "hotel_day_use_guest",
    row?.id ?? null,
    session.hotelId,
    { bookingId, roomNo: room.room_no, stayHours, price, shiftId },
  );

  return NextResponse.json({ success: true, record: row ? clientRow(row) : null });
}

export async function PATCH(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.role === "hotel_admin" && isMobileOrTabletUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ error: "Hotel admin access is allowed only from a desktop or laptop computer." }, { status: 403 });
  }
  if (session.role !== "hotel_admin" || !session.hotelId) {
    return NextResponse.json({ error: "Hotel login required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { id?: string; action?: string };
  if (!body.id || body.action !== "checkout") {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const response = await supabaseRequest(
    `?id=eq.${encodeURIComponent(body.id)}&hotel_id=eq.${encodeURIComponent(session.hotelId)}&status=eq.checked_in`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "checked_out",
        checked_out_by: session.username,
      }),
    },
    "hotel_day_use_guests",
  );

  if (!response.ok) {
    console.error("[day-use] Database checkout failed.", { status: response.status });
    return NextResponse.json({ error: "Unable to check out this guest. Please retry once." }, { status: 500 });
  }

  const rows = (await response.json()) as DayUseRow[];
  if (!rows.length) {
    return NextResponse.json({ error: "Guest is already checked out or the record was not found." }, { status: 409 });
  }

  const row = rows[0];
  await writeAuditLog(
    session,
    "day_use_guest_checked_out",
    "hotel_day_use_guest",
    row.id,
    session.hotelId,
    { checkedOutAt: row.checked_out_at },
  );

  return NextResponse.json({ success: true, record: clientRow(row) });
}
