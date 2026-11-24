import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCountdown, secondsLeft } from "./countdown.ts";

const now = Date.parse("2026-11-24T10:00:00Z");

test("counts down and never goes below zero", () => {
  assert.equal(secondsLeft("2026-11-24T10:15:00Z", now), 900);
  assert.equal(secondsLeft("2026-11-24T10:00:00Z", now), 0);
  assert.equal(secondsLeft("2026-11-24T09:00:00Z", now), 0);
  assert.equal(secondsLeft("2026-11-24T17:15:00+07:00", now), 900);
});

test("a broken expiry counts as expired", () => {
  assert.equal(secondsLeft("", now), 0);
  assert.equal(secondsLeft("not a date", now), 0);
});

test("formats minutes and seconds", () => {
  assert.equal(formatCountdown(900), "15:00");
  assert.equal(formatCountdown(61), "01:01");
  assert.equal(formatCountdown(0), "00:00");
});
