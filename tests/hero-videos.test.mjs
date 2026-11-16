import assert from "node:assert/strict";
import { test } from "node:test";
import { byOrder, dashboardOwnerEmail, fallbackHeroReels, heroVideoUrl, looksLikeMp4, moveId, toReel, validateUpload } from "../src/lib/hero-videos.ts";
import { createHandlers } from "../src/app/api/hero-videos/route.ts";

const mp4 = (size, name = "reel.mp4", type = "video/mp4") => ({ size, name, type });

test("validateUpload accepts a small MP4 with a title and explains every rejection", () => {
  assert.equal(validateUpload(mp4(6 * 1024 * 1024), "Reel"), null);
  assert.equal(validateUpload(mp4(6 * 1024 * 1024, "reel.MP4", ""), "Reel"), null);
  assert.match(validateUpload(mp4(1000), "   "), /Title/);
  assert.match(validateUpload(mp4(1000), "x".repeat(81)), /Title/);
  assert.match(validateUpload(null, "Reel"), /Choose/);
  assert.match(validateUpload(mp4(0), "Reel"), /Choose/);
  assert.match(validateUpload(mp4(1000, "clip.mov", "video/quicktime"), "Reel"), /MP4/);
  assert.match(validateUpload(mp4(20 * 1024 * 1024), "Reel"), /20\.0 MB.*15 MB.*1080×1920/);
});

test("moveId swaps neighbours and leaves impossible moves alone", () => {
  assert.deepEqual(moveId(["a", "b", "c"], "b", -1), ["b", "a", "c"]);
  assert.deepEqual(moveId(["a", "b", "c"], "b", 1), ["a", "c", "b"]);
  assert.deepEqual(moveId(["a", "b", "c"], "a", -1), ["a", "b", "c"]);
  assert.deepEqual(moveId(["a", "b", "c"], "c", 1), ["a", "b", "c"]);
  assert.deepEqual(moveId(["a", "b", "c"], "zz", 1), ["a", "b", "c"]);
});

test("videos become hero reels in sort order with encoded public URLs", () => {
  const rows = [
    { id: "2", created_at: "2026-01-02", title: "Second", key: "hero/b c.mp4", sort_order: 2 },
    { id: "1", created_at: "2026-01-01", title: "First", key: "portfolio/001.mp4", sort_order: 1 },
  ];
  assert.deepEqual(byOrder(rows).map(toReel), [
    { label: "First", src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/001.mp4" },
    { label: "Second", src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/hero/b%20c.mp4" },
  ]);
  assert.equal(heroVideoUrl("portfolio/0010.mp4"), fallbackHeroReels.at(-1).src);
  assert.equal(fallbackHeroReels.length, 10);
});

const config = { url: "https://demo.supabase.co", key: "sb_publishable_test" };
const row = { id: "11111111-1111-4111-8111-111111111111", created_at: "2026-01-01", title: "Reel", key: "hero/x.mp4", sort_order: 3 };

function fakeBucket() {
  const bucket = { puts: [], deletes: [], put: async (key) => { bucket.puts.push(key); }, delete: async (key) => { bucket.deletes.push(key); } };
  return bucket;
}

async function withFetch(handler, run) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => { calls.push({ url: String(url), init }); return handler(String(url), init, calls.length); };
  try { return await run(calls); } finally { globalThis.fetch = original; }
}

const authed = (url) => url.endsWith("/auth/v1/user") ? Response.json({ email: dashboardOwnerEmail }) : null;
const mp4Bytes = (size) => { const b = new Uint8Array(size); b.set([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]); return b; };

test("GET lists videos publicly and caches briefly; without config it is 503", async () => {
  const handlers = createHandlers({ bucket: fakeBucket, env: () => config });
  await withFetch(() => Response.json([{ ...row, sort_order: 2 }, { ...row, id: "22222222-2222-4222-8222-222222222222", sort_order: 1 }]), async () => {
    const response = await handlers.GET();
    assert.equal(response.headers.get("cache-control"), "public, max-age=60");
    assert.deepEqual((await response.json()).map((video) => video.sort_order), [1, 2]);
  });
  assert.equal((await createHandlers({ bucket: fakeBucket, env: () => ({}) }).GET()).status, 503);
});

test("POST needs a valid session, stores the file in R2, then inserts the row after the last one", async () => {
  const bucket = fakeBucket();
  const handlers = createHandlers({ bucket: () => bucket, env: () => config });
  const form = new FormData();
  form.set("title", "New reel");
  form.set("file", new File([mp4Bytes(2048)], "new.mp4", { type: "video/mp4" }));
  const request = (headers) => new Request("http://localhost/api/hero-videos", { method: "POST", headers, body: form });

  await withFetch(() => new Response("", { status: 401 }), async () => {
    assert.equal((await handlers.POST(request({ Authorization: "Bearer bad" }))).status, 401);
  });
  await withFetch(() => Response.json({ email: "someone-else@example.com" }), async () => {
    assert.equal((await handlers.POST(request({ Authorization: "Bearer other-user" }))).status, 401);
    assert.equal(bucket.puts.length, 0);
  });
  await withFetch((url, init) => authed(url) ?? (init.method === "POST" ? Response.json([{ ...row, title: "New reel" }], { status: 201 }) : Response.json([row])), async (calls) => {
    const response = await handlers.POST(request({ Authorization: "Bearer good" }));
    assert.equal(response.status, 201);
    assert.equal((await response.json()).title, "New reel");
    assert.equal(bucket.puts.length, 1);
    assert.match(bucket.puts[0], /^hero\/[0-9a-f-]{36}\.mp4$/);
    const insert = calls.find((call) => call.init.method === "POST");
    assert.deepEqual(JSON.parse(insert.init.body), { title: "New reel", key: bucket.puts[0], sort_order: 4 });
    assert.equal(insert.init.headers.Authorization, "Bearer good");
  });
});

test("POST rejects a non-MP4 body and an oversized declared size before touching R2", async () => {
  const bucket = fakeBucket();
  const handlers = createHandlers({ bucket: () => bucket, env: () => config });
  const form = new FormData();
  form.set("title", "Fake");
  form.set("file", new File([new Uint8Array(2048)], "fake.mp4", { type: "video/mp4" }));
  await withFetch((url) => authed(url) ?? Response.json([]), async () => {
    const response = await handlers.POST(new Request("http://localhost/api/hero-videos", { method: "POST", headers: { Authorization: "Bearer good" }, body: form }));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /not an MP4/);
    const declared = new Request("http://localhost/api/hero-videos", { method: "POST", headers: { Authorization: "Bearer good", "Content-Length": String(40 * 1024 * 1024) }, body: form });
    assert.equal((await handlers.POST(declared)).status, 413);
    assert.equal(bucket.puts.length, 0);
  });
  assert.equal(looksLikeMp4(mp4Bytes(64)), true);
  assert.equal(looksLikeMp4(new Uint8Array(64)), false);
});

test("POST rejects an oversized file before touching R2", async () => {
  const bucket = fakeBucket();
  const handlers = createHandlers({ bucket: () => bucket, env: () => config });
  const form = new FormData();
  form.set("title", "Big");
  form.set("file", new File([new Uint8Array(16 * 1024 * 1024)], "big.mp4", { type: "video/mp4" }));
  await withFetch((url) => authed(url) ?? Response.json([]), async () => {
    const response = await handlers.POST(new Request("http://localhost/api/hero-videos", { method: "POST", headers: { Authorization: "Bearer good" }, body: form }));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /15 MB/);
    assert.equal(bucket.puts.length, 0);
  });
});

test("DELETE removes the row and only dashboard uploads from R2", async () => {
  const bucket = fakeBucket();
  const handlers = createHandlers({ bucket: () => bucket, env: () => config });
  const del = (id) => new Request(`http://localhost/api/hero-videos?id=${id}`, { method: "DELETE", headers: { Authorization: "Bearer good" } });
  await withFetch((url) => authed(url) ?? Response.json([row]), async () => {
    assert.equal((await handlers.DELETE(del(row.id))).status, 200);
    assert.deepEqual(bucket.deletes, ["hero/x.mp4"]);
  });
  await withFetch((url) => authed(url) ?? Response.json([{ ...row, key: "portfolio/001.mp4" }]), async () => {
    assert.equal((await handlers.DELETE(del(row.id))).status, 200);
    assert.deepEqual(bucket.deletes, ["hero/x.mp4"]);
  });
  await withFetch((url) => authed(url) ?? Response.json([]), async () => {
    assert.equal((await handlers.DELETE(del("not-a-uuid"))).status, 400);
    assert.equal((await handlers.DELETE(del(row.id))).status, 404);
  });
});

test("PATCH writes sort_order from the given id order and validates the body", async () => {
  const handlers = createHandlers({ bucket: fakeBucket, env: () => config });
  const ids = [row.id, "22222222-2222-4222-8222-222222222222"];
  const patch = (body) => new Request("http://localhost/api/hero-videos", { method: "PATCH", headers: { Authorization: "Bearer good" }, body: JSON.stringify(body) });
  await withFetch((url) => authed(url) ?? new Response(null, { status: 204 }), async (calls) => {
    assert.equal((await handlers.PATCH(patch({ ids }))).status, 200);
    const updates = calls.filter((call) => call.init.method === "PATCH");
    assert.deepEqual(updates.map((call) => [call.url.split("id=eq.")[1], JSON.parse(call.init.body).sort_order]), [[ids[0], 1], [ids[1], 2]]);
  });
  await withFetch((url) => authed(url) ?? new Response(null, { status: 204 }), async () => {
    assert.equal((await handlers.PATCH(patch({ ids: ["nope"] }))).status, 400);
    assert.equal((await handlers.PATCH(patch({}))).status, 400);
  });
});
