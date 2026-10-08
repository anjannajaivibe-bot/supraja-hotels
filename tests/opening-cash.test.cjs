const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const { NextRequest } = require("next/server");

const root = path.resolve(__dirname, "..");
const session = { role: "hotel_admin", hotelId: "hotel-1", username: "hotel-user" };

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  const localRequire = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith("@/")) return load(`${name.slice(2)}.ts`, mocks);
    return require(name);
  };
  new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
  return module.exports;
}

function mocksFor(database, role = "hotel_admin") {
  return {
    "@/lib/admin-auth": { getAdminSession: () => ({ ...session, role }) },
    "@/lib/hotel-ops": {
      hotelScope: (_session, hotel) => role === "master" ? hotel : session.hotelId,
      verifyStoredPassword: () => true,
      writeAuditLog: async () => {},
    },
    "@/lib/attendance-verification": {
      validateAttendanceVerification: async () => ({ ok: true, verificationId: "verified-1", reviewRequired: false }),
      consumeAttendanceVerification: async () => {},
      getHotelAttendanceConfig: async () => ({ name: "Test Hotel", attendance_verification_mode: "off" }),
      hashAttendanceCode: () => "test-hash",
    },
    "@/lib/supabase-rest": { supabaseRequest: database },
  };
}

function postRequest(url, body) {
  return new NextRequest(`https://example.test${url}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

test("opening cash rejects missing and malformed values but accepts explicit zero", () => {
  const { parseOpeningCash } = load("lib/opening-cash.ts");
  for (const value of [undefined, null, "", " ", false, true, [], {}, -1, "-0.01", "abc", Infinity, NaN, "0x10", "1e3", 10000000000]) {
    assert.ok(parseOpeningCash(value).error, `should reject ${String(value)}`);
  }
  for (const value of [0, "0", "0.00", " 0 "]) assert.equal(parseOpeningCash(value).amount, 0);
  assert.equal(parseOpeningCash("3050").amount, 3050);
  assert.equal(parseOpeningCash(123.456).amount, 123.46);
});

test("shift start rejects blank cash before any database write", async () => {
  let calls = 0;
  const { POST } = load("app/api/admin/shifts/route.ts", mocksFor(async () => { calls++; throw Error("unexpected call"); }));
  for (const openingCashAmount of [undefined, null, "", " ", false, [], -1]) {
    const response = await POST(postRequest("/api/admin/shifts", {
      action: "start", employeeId: "employee-1", pin: "1234", shiftType: "morning", openingCashAmount,
    }));
    assert.equal(response.status, 400);
  }
  assert.equal(calls, 0);
});

for (const failCashWrite of [false, true]) {
  test(failCashWrite ? "cash save failure rolls back the new shift" : "shift start saves zero as completed opening cash", async () => {
    const writes = [];
    const { POST } = load("app/api/admin/shifts/route.ts", mocksFor(async (_query, init, table) => {
      if (init.method) {
        writes.push({ table, method: init.method, body: init.body ? JSON.parse(init.body) : null });
        if (table === "hotel_shifts" && init.method === "POST") return Response.json([{ id: "shift-new" }]);
        if (table === "hotel_checklist_entries") return Response.json(failCashWrite ? {} : [{ id: "cash-new" }], { status: failCashWrite ? 500 : 201 });
        return Response.json([]);
      }
      if (table === "hotel_shifts") return Response.json([]);
      if (table === "hotel_employees") return Response.json([{ id: "employee-1", name: "Test Receptionist", is_active: true, pin_hash: "mock" }]);
      throw Error(`unexpected table ${table}`);
    }));
    const response = await POST(postRequest("/api/admin/shifts", {
      action: "start", employeeId: "employee-1", pin: "1234", shiftType: "morning", lateReason: "Testing", openingCashAmount: "0", verificationId: "verified-1",
    }));
    assert.equal(response.status, failCashWrite ? 500 : 200);
    const cash = writes.find((entry) => entry.table === "hotel_checklist_entries").body;
    assert.equal(cash.opening_cash_amount, 0);
    assert.equal(cash.is_completed, true);
    assert.equal(cash.scope_key, "shift:shift-new");
    assert.equal(writes.some((entry) => entry.method === "DELETE" && entry.table === "hotel_shifts"), failCashWrite);
  });
}

test("attendance code cannot be generated with missing opening cash", async () => {
  let calls = 0;
  const { POST } = load("app/api/admin/attendance-verifications/route.ts", mocksFor(async () => { calls++; throw Error("unexpected call"); }));
  const response = await POST(postRequest("/api/admin/attendance-verifications", {
    subjectType: "employee", subjectId: "employee-1", action: "reception_start",
  }));
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test("attendance code accepts an explicit zero opening cash amount", async () => {
  const { POST } = load("app/api/admin/attendance-verifications/route.ts", mocksFor(async (_query, init, table) => {
    if (table === "hotel_employees") return Response.json([{ id: "employee-1", name: "Test Receptionist", is_active: true }]);
    if (table === "hotel_attendance_verifications" && init.method === "POST") return Response.json([{ id: "verification-1", status: "pending", expires_at: "2026-10-08T05:00:00Z" }]);
    return Response.json([]);
  }));
  const response = await POST(postRequest("/api/admin/attendance-verifications", {
    subjectType: "employee", subjectId: "employee-1", action: "reception_start", openingCashAmount: "0",
  }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).verification.code, /^\d{6}$/);
});

test("opening cash cannot be cleared after the shift starts", async () => {
  let calls = 0;
  const { POST } = load("app/api/admin/checklists/route.ts", mocksFor(async () => { calls++; throw Error("unexpected call"); }));
  const response = await POST(postRequest("/api/admin/checklists", {
    checklistType: "shift_start", itemKey: "cash_opening_verified", completed: false,
  }));
  assert.equal(response.status, 409);
  assert.equal(calls, 0);
});

test("shift checklist query includes all active-shift entries across midnight", () => {
  const { checklistScopeFilter } = load("lib/checklist-scope.ts");
  const params = new URLSearchParams(checklistScopeFilter("2026-10-08", ["shift-1"]).slice(1));
  assert.equal(params.has("checklist_date"), false);
  assert.equal(params.get("or"), "(and(checklist_type.eq.daily,checklist_date.eq.2026-10-08,scope_key.eq.daily:2026-10-08),shift_id.in.(shift-1),scope_key.in.(shift:shift-1))");
  assert.equal(new URLSearchParams(checklistScopeFilter("2026-10-08", []).slice(1)).get("or"), "(and(checklist_type.eq.daily,checklist_date.eq.2026-10-08,scope_key.eq.daily:2026-10-08))");
});

for (const role of ["hotel_admin", "master"]) {
  test(`${role} sees cash and completed shift checks from before midnight`, async () => {
    const cash = { hotel_id: "hotel-1", checklist_date: "2026-10-07", checklist_type: "shift_start", item_key: "cash_opening_verified", is_completed: true, opening_cash_amount: 0, shift_id: "shift-1", scope_key: "shift:shift-1" };
    const db = async (query, _init, table) => {
      if (table === "hotels") return Response.json([{ id: "hotel-1", name: "Test Hotel", code: "TEST" }]);
      if (table === "hotel_shifts") return Response.json([{ id: "shift-1", hotel_id: "hotel-1", display_name: "Test Receptionist", status: "active" }]);
      if (table === "hotel_checklist_entries") {
        const params = new URLSearchParams(query);
        assert.equal(params.has("checklist_date"), false, "calendar filter must not hide night-shift cash");
        assert.ok(params.get("or").includes("shift_id.in.(shift-1)"));
        return Response.json([cash]);
      }
      return Response.json([]);
    };
    const overrides = mocksFor(db, role);
    const { GET: getSummary } = load("app/api/admin/home-summary/route.ts", overrides);
    const summary = await (await getSummary(new NextRequest("https://example.test/api/admin/home-summary"))).json();
    assert.equal(summary.hotels[0].openingCash, 0);
    assert.equal(summary.hotels[0].checklists.shiftStart.done, 1);
    const { GET: getChecklists } = load("app/api/admin/checklists/route.ts", overrides);
    const checklists = await (await getChecklists(new NextRequest("https://example.test/api/admin/checklists?hotelId=hotel-1"))).json();
    assert.equal(checklists.entries[0].opening_cash_amount, 0);
    assert.equal(checklists.activeShift.id, "shift-1");
  });
}
