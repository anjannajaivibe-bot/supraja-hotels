import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { hotelScope, writeAuditLog } from "@/lib/hotel-ops";
import { supabaseRequest } from "@/lib/supabase-rest";

function mondayIst(date = new Date()) {
  const ist = new Date(date.getTime() + 330 * 60 * 1000);
  const day = ist.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  ist.setUTCDate(ist.getUTCDate() + diff);
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth()+1).padStart(2,"0")}-${String(ist.getUTCDate()).padStart(2,"0")}`;
}

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hotelId = hotelScope(session, request.nextUrl.searchParams.get("hotelId"));
  if (!hotelId) return NextResponse.json({ error: "Select a hotel." }, { status: 400 });

  const [itemsRes, checksRes] = await Promise.all([
    supabaseRequest(`?select=*&hotel_id=eq.${encodeURIComponent(hotelId)}&is_active=eq.true&order=category.asc,item_name.asc`, {}, "hotel_inventory_items"),
    supabaseRequest(`?select=id,hotel_id,week_start,checked_by,checked_at,notes&hotel_id=eq.${encodeURIComponent(hotelId)}&order=week_start.desc&limit=8`, {}, "hotel_inventory_checks"),
  ]);
  if (!itemsRes.ok || !checksRes.ok) return NextResponse.json({ error: "Unable to load inventory." }, { status: 500 });
  const items = await itemsRes.json() as Array<{ id: string }>;
  const checks = await checksRes.json() as Array<{ id: string }>;
  const ids = checks.map((c) => encodeURIComponent(c.id)).join(",");
  let checkItems: Array<{check_id:string;inventory_item_id:string;expected_qty:number;physical_qty:number;condition:string;remarks:string|null}> = [];
  if (ids) {
    const ciRes = await supabaseRequest(`?select=check_id,inventory_item_id,expected_qty,physical_qty,condition,remarks&check_id=in.(${ids})`, {}, "hotel_inventory_check_items");
    if (ciRes.ok) checkItems = await ciRes.json();
  }
  return NextResponse.json({
    weekStart: mondayIst(),
    items,
    checks: checks.map((check) => ({ ...check, items: checkItems.filter((x) => x.check_id === check.id) })),
  });
}

export async function POST(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as {
    action?: "add_item" | "weekly_check";
    hotelId?: string;
    category?: string;
    itemName?: string;
    expectedQty?: number;
    location?: string;
    notes?: string;
    entries?: Array<{inventoryItemId?:string;physicalQty?:number;condition?:string;remarks?:string}>;
  };
  const hotelId = hotelScope(session, body.hotelId ?? null);
  if (!hotelId) return NextResponse.json({ error: "Select a hotel." }, { status: 400 });

  if (body.action === "add_item") {
    if (!body.category?.trim() || !body.itemName?.trim()) return NextResponse.json({ error: "Category and item name are required." }, { status: 400 });
    const expectedQty = Math.max(0, Number(body.expectedQty) || 0);
    const res = await supabaseRequest("?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ hotel_id: hotelId, category: body.category.trim(), item_name: body.itemName.trim(), expected_qty: expectedQty, location: body.location?.trim() || null, created_by: session.displayName || session.username }),
    }, "hotel_inventory_items");
    if (!res.ok) return NextResponse.json({ error: "Unable to add inventory item. It may already exist." }, { status: 409 });
    const row = (await res.json() as Array<{id:string}>)[0];
    await writeAuditLog(session, "inventory_item_added", "hotel_inventory_item", row?.id ?? null, hotelId, { category: body.category.trim(), itemName: body.itemName.trim(), expectedQty });
    return NextResponse.json({ success: true });
  }

  if (body.action === "weekly_check") {
    const entries = (body.entries ?? []).filter((e) => e.inventoryItemId);
    if (!entries.length) return NextResponse.json({ error: "There are no inventory items to verify." }, { status: 400 });
    const weekStart = mondayIst();
    const existsRes = await supabaseRequest(`?select=id&hotel_id=eq.${encodeURIComponent(hotelId)}&week_start=eq.${weekStart}&limit=1`, {}, "hotel_inventory_checks");
    if (existsRes.ok && (await existsRes.json() as Array<{id:string}>).length) return NextResponse.json({ error: "This week's inventory verification is already submitted." }, { status: 409 });

    const itemsRes = await supabaseRequest(`?select=id,expected_qty&hotel_id=eq.${encodeURIComponent(hotelId)}&is_active=eq.true`, {}, "hotel_inventory_items");
    if (!itemsRes.ok) return NextResponse.json({ error: "Unable to verify inventory master." }, { status: 500 });
    const master = await itemsRes.json() as Array<{id:string;expected_qty:number}>;
    const map = new Map(master.map((x) => [x.id, x]));
    const checkRes = await supabaseRequest("?select=*", {
      method: "POST", headers: { Prefer: "return=representation" },
      body: JSON.stringify({ hotel_id: hotelId, week_start: weekStart, checked_by: session.displayName || session.username, notes: body.notes?.trim() || null }),
    }, "hotel_inventory_checks");
    if (!checkRes.ok) return NextResponse.json({ error: "Unable to create weekly inventory verification." }, { status: 500 });
    const check = (await checkRes.json() as Array<{id:string}>)[0];
    const rows = entries.map((entry) => {
      const item = map.get(entry.inventoryItemId!);
      return {
        check_id: check.id,
        inventory_item_id: entry.inventoryItemId,
        expected_qty: item?.expected_qty ?? 0,
        physical_qty: Math.max(0, Number(entry.physicalQty) || 0),
        condition: ["good","repair_required","damaged","missing","replace_soon"].includes(entry.condition || "") ? entry.condition : "good",
        remarks: entry.remarks?.trim() || null,
      };
    });
    const ciRes = await supabaseRequest("", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(rows) }, "hotel_inventory_check_items");
    if (!ciRes.ok) {
      await supabaseRequest(`?id=eq.${encodeURIComponent(check.id)}`, { method: "DELETE" }, "hotel_inventory_checks");
      return NextResponse.json({ error: "Unable to save weekly inventory quantities." }, { status: 500 });
    }
    const variances = rows.filter((x) => x.physical_qty !== x.expected_qty || x.condition !== "good").length;
    await writeAuditLog(session, "inventory_weekly_check_submitted", "hotel_inventory_check", check.id, hotelId, { weekStart, itemCount: rows.length, varianceCount: variances });
    return NextResponse.json({ success: true, varianceCount: variances });
  }

  return NextResponse.json({ error: "Invalid inventory action." }, { status: 400 });
}
