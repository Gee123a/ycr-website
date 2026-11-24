import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRupiah } from "./amount.ts";

test("reads the ways people write rupiah", () => {
  for (const raw of ["50000", "50.000", "50,000", "Rp 50.000", "rp50000", " 50000 "]) {
    assert.equal(parseRupiah(raw), 50000, raw);
  }
  assert.equal(parseRupiah("1.250.000"), 1250000);
});

test("refuses to guess", () => {
  for (const raw of ["", "Rp", "abc", "-50000", "50.00", "5.0000", "50,5", "1e5", "50 000", "50k"]) {
    assert.ok(Number.isNaN(parseRupiah(raw)), raw);
  }
});
