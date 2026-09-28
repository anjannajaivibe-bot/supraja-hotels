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
  const items = await itemsRes.json() as Array<{ id: string; batch_id: string }>;
  const receiptsRes = await supabaseRequest(`?select=id,batch_id,item_id,received_date,quantity_received,rewash_qty,missing_qty,damaged_qty,remarks,recorded_by,created_at&batch_id=in.(${ids})&order=received_date.desc,created_at.desc`, {}, "hotel_laundry_receipts");
  const receipts = receiptsRes.ok ? await receiptsRes.json() as Array<{ item_id: string }> : [];
  return NextResponse.json({ batches: batches.map((batch) => ({
    ...batch,
    items: items.filter((item) => item.batch_id === batch.id).map((item) => ({
      ...item,
      receipts: receipts.filter((receipt) => receipt.item_id === item.id),
    })),
  })) });
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
    correctionReason?: string;
    items?: LaundryItemInput[];
    receivedDate?: string;
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
    if (!body.receivedDate || !/^\d{4}-\d{2}-\d{2}$/.test(body.receivedDate)) {
      return NextResponse.json({ error: "Select the actual received date." }, { status: 400 });
    }
    const batchRes = await supabaseRequest(`?select=id,hotel_id,status&id=eq.${encodeURIComponent(body.batchId)}&hotel_id=eq.${encodeURIComponent(hotelId)}&limit=1`, {}, "hotel_laundry_batches");
    if (!batchRes.ok) return NextResponse.json({ error: "Unable to verify laundry batch." }, { status: 500 });
    const batch = (await batchRes.json() as Array<{ id: string; status: string }>)[0];
    if (!batch) return NextResponse.json({ error: "Laundry batch not found." }, { status: 404 });

    const existingRes = await supabaseRequest(`?select=id,item_name,quantity_sent,quantity_received,rewash_qty,missing_qty,damaged_qty,remarks&batch_id=eq.${encodeURIComponent(batch.id)}`, {}, "hotel_laundry_items");
    if (!existingRes.ok) return NextResponse.json({ error: "Unable to load laundry items for validation." }, { status: 500 });
    const existing = await existingRes.json() as Array<{id:string;item_name:string;quantity_sent:number;quantity_received:number;rewash_qty:number;missing_qty:number;damaged_qty:number;remarks:string|null}>;
    const existingMap = new Map(existing.map((item) => [item.id, item]));
    const updates = body.items ?? [];
    const receiptRows: Array<Record<string, unknown>> = [];

    for (const item of updates) {
      const id = (item as LaundryItemInput & { id?: string }).id;
      if (!id) continue;
      const current = existingMap.get(id);
      if (!current) return NextResponse.json({ error: "Laundry item does not belong to this batch." }, { status: 400 });
      const addReceived = Math.max(0, Number(item.quantityReceived) || 0);
      const addRewash = Math.max(0, Number(item.rewashQty) || 0);
      const addMissing = Math.max(0, Number(item.missingQty) || 0);
      const addDamaged = Math.max(0, Number(item.damagedQty) || 0);
      if (addReceived + addMissing + addDamaged > Math.max(0, current.quantity_sent - current.quantity_received - current.missing_qty - current.damaged_qty)) {
        return NextResponse.json({ error: `${current.item_name}: entered quantities exceed the pending quantity.` }, { status: 400 });
      }
      if (addReceived + addRewash + addMissing + addDamaged === 0 && !item.remarks?.trim()) continue;

      const nextReceived = current.quantity_received + addReceived;
      const nextRewash = current.rewash_qty + addRewash;
      const nextMissing = current.missing_qty + addMissing;
      const nextDamaged = current.damaged_qty + addDamaged;
      const patchRes = await supabaseRequest(
        `?id=eq.${encodeURIComponent(id)}&batch_id=eq.${encodeURIComponent(batch.id)}`,
        { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({
          quantity_received: nextReceived, rewash_qty: nextRewash, missing_qty: nextMissing, damaged_qty: nextDamaged,
          remarks: item.remarks?.trim() || current.remarks || null, updated_at: new Date().toISOString(),
        }) },
        "hotel_laundry_items",
      );
      if (!patchRes.ok) return NextResponse.json({ error: "Unable to update received laundry." }, { status: 500 });
      receiptRows.push({
        batch_id: batch.id, item_id: id, received_date: body.receivedDate,
        quantity_received: addReceived, rewash_qty: addRewash, missing_qty: addMissing, damaged_qty: addDamaged,
        remarks: item.remarks?.trim() || null, recorded_by: session.displayName || session.username,
      });
    }
    if (!receiptRows.length) return NextResponse.json({ error: "Enter at least one received, rewash, missing or damaged quantity." }, { status: 400 });

    const receiptRes = await supabaseRequest("", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(receiptRows) }, "hotel_laundry_receipts");
    if (!receiptRes.ok) return NextResponse.json({ error: "Laundry quantities were updated but receipt history could not be recorded. Contact Master Admin." }, { status: 500 });

    const itemsRes = await supabaseRequest(`?select=id,item_name,quantity_sent,quantity_received,rewash_qty,missing_qty,damaged_qty,remarks&batch_id=eq.${encodeURIComponent(batch.id)}`, {}, "hotel_laundry_items");
    const saved = itemsRes.ok ? await itemsRes.json() as Array<{id:string;item_name:string;quantity_sent:number;quantity_received:number;rewash_qty:number;missing_qty:number;damaged_qty:number;remarks:string|null}> : [];
    const unresolved = saved.reduce((sum, item) => sum + Math.max(0, item.quantity_sent - item.quantity_received - item.missing_qty - item.damaged_qty), 0);
    const status = unresolved === 0 ? "closed" : "open";
    const now = new Date().toISOString();
    const batchPatch = await supabaseRequest(`?id=eq.${encodeURIComponent(batch.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status, received_at: status === "closed" ? body.receivedDate + "T12:00:00.000Z" : null, updated_at: now }) }, "hotel_laundry_batches");
    if (!batchPatch.ok) return NextResponse.json({ error: "Receipt saved, but batch status could not be updated." }, { status: 500 });

    await writeAuditLog(session, "laundry_receipt_recorded", "hotel_laundry_batch", batch.id, hotelId, {
      previousStatus: batch.status, status, unresolved, receivedDate: body.receivedDate, receiptRows,
    });
    return NextResponse.json({ success: true, status, unresolved });
  }

  return NextResponse.json({ error: "Invalid laundry action." }, { status: 400 });
}
