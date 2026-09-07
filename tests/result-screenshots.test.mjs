import assert from "node:assert/strict";
import { test } from "node:test";
import { resultScreenshots } from "../src/lib/result-screenshots.ts";

test("all supplied result screenshots have unique, encoded sources and transcribed counts", () => {
  assert.equal(resultScreenshots.length, 40);
  assert.equal(new Set(resultScreenshots.map(item => item.file)).size, 40);
  for (const item of resultScreenshots) {
    assert.match(item.views, /^\d+(\.\d+)?[KM]$/);
    const url = new URL(item.image);
    assert.equal(url.origin, "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev");
    assert.equal(decodeURIComponent(url.pathname), `/results/${item.file}`);
  }
  assert.equal(resultScreenshots[0].views, "726K");
  assert.equal(resultScreenshots[12].views, "25.6M");
  assert.equal(resultScreenshots[39].views, "249K");
});
