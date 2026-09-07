import assert from "node:assert/strict";
import { test } from "node:test";
import { readdir, readFile } from "node:fs/promises";
import ts from "typescript";
import { GET } from "../src/app/api/media/route.ts";

test("media proxy preserves ranges and gives successful media a bounded cache lifetime", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url.origin, "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev");
      assert.equal(options.headers.get("range"), "bytes=0-3");
      return new Response("abcd", { status: 206, headers: {
        "Content-Range": "bytes 0-3/100", "Content-Length": "4", "ETag": '"version-1"',
      } });
    };
    const response = await GET(new Request("http://localhost/api/media?file=/portfolio/001.mp4", {
      headers: { Range: "bytes=0-3" },
    }));
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("content-range"), "bytes 0-3/100");
    assert.match(response.headers.get("cache-control"), /max-age=86400/);
    assert.equal(await response.text(), "abcd");
  } finally { globalThis.fetch = original; }
});

test("media proxy rejects external targets and does not cache errors", async () => {
  assert.equal((await GET(new Request("http://localhost/api/media?file=//evil.test/a.mp4"))).status, 400);
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(null, { status: 404 });
    const response = await GET(new Request("http://localhost/api/media?file=/missing.mp4"));
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally { globalThis.fetch = original; }
});

test("all passive video elements use the viewport-managed shared owner", async () => {
  async function scan(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) { await scan(path); continue; }
      if (!path.endsWith(".tsx") || path.endsWith("/components/viewport-video.tsx")) continue;
      const source = ts.createSourceFile(path, await readFile(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function visit(node) {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "dialog") {
          assert.ok(path.endsWith("/components/reel-dialog.tsx"), `Use shared ReelDialog in ${path}`);
        }
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "video") {
          const attributes = node.attributes.properties.filter(ts.isJsxAttribute).map(a => a.name.getText(source));
          if (path.endsWith("/components/client-stories.tsx")) {
            for (const required of ["playsInline", "muted", "preload", "onEnded", "aria-label"]) assert.ok(attributes.includes(required), required);
          } else assert.ok(attributes.includes("controls"), path);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  await scan("src");
});
