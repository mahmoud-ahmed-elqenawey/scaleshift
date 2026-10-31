import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchLeads, requestToken } from "../src/lib/leads-client.ts";

const config = { url: "https://demo.supabase.co", apiKey: "sb_publishable_test" };
const inAnHour = () => Math.floor(Date.now() / 1000) + 3600;
const session = (expires_at) => ({ access_token: "old-access", refresh_token: "old-refresh", expires_at, email: "owner@example.com" });

async function withFetch(handler, run) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => { calls.push({ url: String(url), init }); return handler(String(url), init); };
  try { return await run(calls); } finally { globalThis.fetch = original; }
}

test("fetchLeads reads newest leads with the current token when it is still fresh", async () => {
  await withFetch(() => Response.json([{ id: "1" }]), async (calls) => {
    const result = await fetchLeads(config, session(inAnHour()));
    assert.deepEqual(result.leads, [{ id: "1" }]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://demo.supabase.co/rest/v1/contacts?select=*&order=created_at.desc");
    assert.equal(calls[0].init.headers.Authorization, "Bearer old-access");
  });
});

test("fetchLeads refreshes a token that is about to expire before reading", async () => {
  const fresh = { access_token: "new-access", refresh_token: "new-refresh", expires_at: inAnHour(), user: { email: "owner@example.com" } };
  await withFetch((url) => (url.includes("/auth/v1/token") ? Response.json(fresh) : Response.json([])), async (calls) => {
    const result = await fetchLeads(config, session(Math.floor(Date.now() / 1000) + 10));
    assert.match(calls[0].url, /grant_type=refresh_token$/);
    assert.deepEqual(JSON.parse(calls[0].init.body), { refresh_token: "old-refresh" });
    assert.equal(calls[1].init.headers.Authorization, "Bearer new-access");
    assert.equal(result.session.refresh_token, "new-refresh");
  });
});

test("fetchLeads and requestToken surface readable errors", async () => {
  await withFetch(() => new Response("{}", { status: 401 }), () =>
    assert.rejects(fetchLeads(config, session(inAnHour())), /session expired/));
  await withFetch(() => Response.json({ error_description: "Invalid login credentials" }, { status: 400 }), () =>
    assert.rejects(requestToken(config, "password", { email: "a@b.co", password: "x" }), /Invalid login credentials/));
});
