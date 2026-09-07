import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

type LaundryItemInput = {
  itemName?: string;
  quantitySent?: number;
  quantityReceived?: number;
  rewashQty?: number;
  missingQty?: number;
  damagedQty?: number;
  remarks?: string;
};

function resolveHotel(session: NonNullable<ReturnType<typeof getAdminSession>>, requested?: string | null) {
  return hotelScope(session, requested);
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = resolveHotel(session, request.nextUrl.searchParams.get("hotelId"));
  if (!hotelId) return NextResponse.json({ error: "Select a hotel." }, { status: 400 });

  const batchesRes = await supabaseRequest(
    `?select=id,hotel_id,vendor_name,dispatch_note,dispatched_at,received_at,status,created_by,created_at&hotel_id=eq.${encodeURIComponent(hotelId)}&order=dispatched_at.desc&limit=100`,
    {},
    "hotel_laundry_batches",
  );
  if (!batchesRes.ok) return NextResponse.json({ error: "Unable to load laundry history." }, { status: 500 });
  const batches = await batchesRes.json() as Array<{ id: string }>;
  if (!batches.length) return NextResponse.json({ batches: [] });

  const ids = batches.map((b) => encodeURIComponent(b.id)).join(",");
  const itemsRes = await supabaseRequest(`?select=*&batch_id=in.(${ids})&order=created_at.asc`, {}, "hotel_laundry_items");
  if (!itemsRes.ok) return NextResponse.json({ error: "Unable to load laundry items." }, { status: 500 });
  const items = await itemsRes.json() as Array<{ batch_id: string }>;
  return NextResponse.json({ batches: batches.map((batch) => ({ ...batch, items: items.filter((item) => item.batch_id === batch.id) })) });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as {
    action?: "dispatch" | "receive";
    hotelId?: string;
    vendorName?: string;
    note?: string;
    batchId?: string;
    items?: LaundryItemInput[];
  };
  const hotelId = resolveHotel(session, body.hotelId ?? null);
  if (!hotelId) return NextResponse.json({ error: "Select a hotel." }, { status: 400 });

  if (body.action === "dispatch") {
    const items = (body.items ?? []).filter((item) => item.itemName?.trim() && Number(item.quantitySent) > 0);
    if (!items.length) return NextResponse.json({ error: "Add at least one laundry item with quantity sent." }, { status: 400 });
    const invalidReceived = items.some((item) => Math.max(0, Number(item.quantityReceived) || 0) > Math.max(0, Number(item.quantitySent) || 0));
    if (invalidReceived) return NextResponse.json({ error: "Quantity received cannot be greater than quantity sent." }, { status: 400 });

    const normalized = items.map((item) => ({
      itemName: item.itemName!.trim(),
      quantitySent: Math.max(0, Number(item.quantitySent) || 0),
      quantityReceived: Math.max(0, Number(item.quantityReceived) || 0),
      remarks: item.remarks?.trim() || null,
    }));
    const allReceived = normalized.every((item) => item.quantityReceived === item.quantitySent);
    const anyReceived = normalized.some((item) => item.quantityReceived > 0);
    const initialStatus = allReceived ? "closed" : anyReceived ? "partial" : "open";
    const now = new Date().toISOString();

    const batchRes = await supabaseRequest("?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        hotel_id: hotelId,
        vendor_name: body.vendorName?.trim() || null,
        dispatch_note: body.note?.trim() || null,
        status: initialStatus,
        received_at: allReceived ? now : null,
        created_by: session.displayName || session.username,
      }),
    }, "hotel_laundry_batches");
    if (!batchRes.ok) return NextResponse.json({ error: "Unable to create laundry dispatch." }, { status: 500 });
    const batch = (await batchRes.json() as Array<{ id: string }>)[0];
    if (!batch?.id) return NextResponse.json({ error: "Laundry dispatch was not created." }, { status: 500 });

    const rows = normalized.map((item) => ({
      batch_id: batch.id,
      item_name: item.itemName,
      quantity_sent: item.quantitySent,
      quantity_received: item.quantityReceived,
      rewash_qty: 0,
      missing_qty: 0,
      damaged_qty: 0,
      remarks: item.remarks,
    }));
    const itemsRes = await supabaseRequest("", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(rows) }, "hotel_laundry_items");
    if (!itemsRes.ok) {
      await supabaseRequest(`?id=eq.${encodeURIComponent(batch.id)}`, { method: "DELETE" }, "hotel_laundry_batches");
      return NextResponse.json({ error: "Unable to save laundry items." }, { status: 500 });
    }
    await writeAuditLog(session, "laundry_dispatched", "hotel_laundry_batch", batch.id, hotelId, {
      itemCount: rows.length,
      vendorName: body.vendorName?.trim() || null,
      status: initialStatus,
      sentTotal: rows.reduce((sum, item) => sum + item.quantity_sent, 0),
      receivedTotal: rows.reduce((sum, item) => sum + item.quantity_received, 0),
    });
    return NextResponse.json({ success: true, batchId: batch.id, status: initialStatus });
  }

  if (body.action === "receive") {
    if (!body.batchId) return NextResponse.json({ error: "Laundry batch is required." }, { status: 400 });
    const batchRes = await supabaseRequest(`?select=id,hotel_id,status&id=eq.${encodeURIComponent(body.batchId)}&hotel_id=eq.${encodeURIComponent(hotelId)}&limit=1`, {}, "hotel_laundry_batches");
    if (!batchRes.ok) return NextResponse.json({ error: "Unable to verify laundry batch." }, { status: 500 });
    const batch = (await batchRes.json() as Array<{ id: string; status: string }>)[0];
    if (!batch) return NextResponse.json({ error: "Laundry batch not found." }, { status: 404 });

    const updates = body.items ?? [];
    for (const item of updates) {
      const id = (item as LaundryItemInput & { id?: string }).id;
      if (!id) continue;
      const quantityReceived = Math.max(0, Number(item.quantityReceived) || 0);
      const rewashQty = Math.max(0, Number(item.rewashQty) || 0);
      const missingQty = Math.max(0, Number(item.missingQty) || 0);
      const damagedQty = Math.max(0, Number(item.damagedQty) || 0);
      const patchRes = await supabaseRequest(
        `?id=eq.${encodeURIComponent(id)}&batch_id=eq.${encodeURIComponent(batch.id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ quantity_received: quantityReceived, rewash_qty: rewashQty, missing_qty: missingQty, damaged_qty: damagedQty, remarks: item.remarks?.trim() || null, updated_at: new Date().toISOString() }),
        },
        "hotel_laundry_items",
      );
      if (!patchRes.ok) return NextResponse.json({ error: "Unable to update received laundry." }, { status: 500 });
    }

    const itemsRes = await supabaseRequest(`?select=quantity_sent,quantity_received,rewash_qty,missing_qty,damaged_qty&batch_id=eq.${encodeURIComponent(batch.id)}`, {}, "hotel_laundry_items");
    const saved = itemsRes.ok ? await itemsRes.json() as Array<{quantity_sent:number;quantity_received:number;rewash_qty:number;missing_qty:number;damaged_qty:number}> : [];
    const unresolved = saved.reduce((sum, item) => sum + Math.max(0, item.quantity_sent - item.quantity_received) + item.rewash_qty + item.missing_qty + item.damaged_qty, 0);
    const anyReceived = saved.some((item) => item.quantity_received > 0 || item.rewash_qty > 0 || item.missing_qty > 0 || item.damaged_qty > 0);
    const status = unresolved === 0 ? "closed" : anyReceived ? "partial" : "open";
    const batchPatch = await supabaseRequest(`?id=eq.${encodeURIComponent(batch.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status, received_at: status === "closed" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }) }, "hotel_laundry_batches");
    if (!batchPatch.ok) return NextResponse.json({ error: "Laundry items updated, but batch status could not be saved." }, { status: 500 });
    await writeAuditLog(session, "laundry_received_updated", "hotel_laundry_batch", batch.id, hotelId, { status, unresolved });
    return NextResponse.json({ success: true, status, unresolved });
  }

  return NextResponse.json({ error: "Invalid laundry action." }, { status: 400 });
}
