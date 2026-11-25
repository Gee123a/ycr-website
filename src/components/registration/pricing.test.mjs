import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Node doesn't know the "@/" alias from tsconfig.json.
registerHooks({
  resolve: (specifier, context, next) =>
    specifier.startsWith("@/")
      ? next(new URL(`../../${specifier.slice(2)}.ts`, import.meta.url).href, context)
      : next(specifier, context),
});
const { registrationMode, ycrPrice } = await import("./pricing.ts");
const { YCR_OPENS_AT } = await import("../../lib/constants.ts");

test("price per person follows the group size, including both sides of each tier", () => {
  for (const [people, perPerson, total] of [
    [1, 150000, 150000],
    [4, 150000, 600000],
    [5, 135000, 675000],
    [9, 135000, 1215000],
    [10, 120000, 1200000],
    [37, 120000, 4440000],
  ]) {
    const price = ycrPrice(people);
    assert.equal(price.perPersonIdr, perPerson, `${people} people`);
    assert.equal(price.totalIdr, total, `${people} people`);
    assert.equal(price.subtotalIdr - price.discountIdr, price.totalIdr);
    assert.ok(Number.isInteger(price.totalIdr));
  }
});

test("the webinar form shows until the exact moment YCR opens", () => {
  const opens = YCR_OPENS_AT;
  assert.equal(registrationMode(opens - 1), "webinar");
  assert.equal(registrationMode(opens), "ycr");
  assert.equal(registrationMode(opens + 1), "ycr");
});
