import assert from "node:assert/strict";
import { test } from "node:test";
import {
  compactNumber,
  machineClips,
  machineSequence,
  machineStats,
} from "../src/lib/retention-machine.ts";

test("counts shorten the way Instagram shows them", () => {
  assert.equal(compactNumber(1_200_000), "1.2M");
  assert.equal(compactNumber(1_000_000), "1M");
  assert.equal(compactNumber(842_000), "842K");
  assert.equal(compactNumber(13_740), "13.7K");
  assert.equal(compactNumber(1_240), "1.2K");
  assert.equal(compactNumber(312), "312");
});

test("every number grows with each published video", () => {
  let previous = machineStats(0);
  assert.equal(previous.posts, 0);
  assert.equal(previous.totalViews, 0);
  for (let landed = 1; landed <= machineClips.length; landed++) {
    const next = machineStats(landed);
    assert.equal(next.posts, landed);
    assert.ok(next.totalViews > previous.totalViews);
    assert.ok(next.likes > previous.likes);
    assert.ok(next.watchTime >= previous.watchTime);
    assert.ok(next.followers > previous.followers);
    previous = next;
  }
});

test("the sequence runs every clip through travel, editing and drop in order", () => {
  const phases = machineSequence.slice(1, -1).map((step) => step.phase);
  assert.deepEqual(phases.slice(0, 3), ["travel", "editing", "drop"]);
  assert.equal(phases.length, machineClips.length * 3);
  assert.deepEqual(machineSequence.at(-1), { index: machineClips.length, phase: "idle" });
  assert.ok(machineClips.every((clip) => clip.raw.includes("/raw/") && clip.edited.includes("/portfolio/")));
});
