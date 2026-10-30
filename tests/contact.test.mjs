import assert from "node:assert/strict";
import { test } from "node:test";
import { POST, parseLead } from "../src/app/api/contact/route.ts";

const lead = {
  full_name: "Sara", email: "sara@example.com", phone: "+966501234567", brand_link: "instagram.com/sara",
  package: "pro", budget: "1500-3000", message: "Hi",
};
const post = (body, ip) => POST(new Request("http://localhost/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body),
}));

test("parseLead trims a complete lead and rejects bad fields", () => {
  assert.deepEqual(parseLead({ ...lead, full_name: "  Sara " }), lead);
  const bad = [{ email: "nope" }, { phone: "0501234567" }, { package: "gold" }, { budget: "1" }, { message: "" }, { message: "x".repeat(5001) }];
  for (const fields of bad) assert.equal(parseLead({ ...lead, ...fields }), null, JSON.stringify(fields));
  assert.equal(parseLead(null), null);
});

test("POST validates, then inserts into Supabase without reading the row back", async () => {
  process.env.SUPABASE_URL = "https://demo.supabase.co";
  process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  assert.equal((await post({ ...lead, email: "nope" }, "1.1.1.1")).status, 400);
  const original = globalThis.fetch;
  try {
    let received;
    globalThis.fetch = async (url, options) => { received = { url, options }; return new Response(null, { status: 201 }); };
    assert.equal((await post(lead, "1.1.1.1")).status, 201);
    assert.equal(received.url, "https://demo.supabase.co/rest/v1/contacts");
    assert.equal(received.options.headers.Prefer, "return=minimal");
    assert.deepEqual(JSON.parse(received.options.body), lead);
    globalThis.fetch = async () => new Response("boom", { status: 500 });
    assert.equal((await post(lead, "1.1.1.1")).status, 502);
  } finally { globalThis.fetch = original; }
});

test("POST rate-limits a single address after five requests a minute", async () => {
  for (let i = 0; i < 5; i += 1) assert.equal((await post({}, "9.9.9.9")).status, 400);
  assert.equal((await post({}, "9.9.9.9")).status, 429);
});
