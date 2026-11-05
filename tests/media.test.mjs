import assert from "node:assert/strict";
import { test } from "node:test";
import { readdir, readFile } from "node:fs/promises";
import ts from "typescript";

test("all passive video elements use the viewport-managed shared owner", async () => {
  async function scan(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) { await scan(path); continue; }
      if (!path.endsWith(".tsx") || path.endsWith("/components/viewport-video.tsx")) continue;
      const source = ts.createSourceFile(path, await readFile(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function visit(node) {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
          const classes = attrs.find(a => a.name.getText(source) === "className")?.initializer;
          if (classes && ts.isStringLiteral(classes) && classes.text.split(/\s+/).some(c => ["impact-reel", "client-review"].includes(c))) {
            assert.equal(node.tagName.getText(source), "figure", `Screenshot must remain passive: ${path}`);
            assert.ok(!attrs.some(a => ["href", "onClick"].includes(a.name.getText(source))), path);
          }
        }
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "dialog") {
          assert.ok(/\/components\/(reel-dialog|contact-form)\.tsx$/.test(path), `Use shared ReelDialog in ${path}`);
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
