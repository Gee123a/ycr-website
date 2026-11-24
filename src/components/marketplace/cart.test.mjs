import assert from "node:assert/strict";
import { test } from "node:test";
import { cartTotalIdr, maxQuantity, parseCart, quantityOf, reconcile, setQuantity } from "./cart.ts";

const TEE = { id: "7f1c2a40-0001-4c6e-9a10-000000000001", priceIdr: 95000, stockAvailable: 5, variantLabels: ["S", "M"] };
const BAG = { id: "7f1c2a40-0003-4c6e-9a10-000000000003", priceIdr: 65000, stockAvailable: 100, variantLabels: [] };
const small = { productId: TEE.id, variantLabel: "S" };
const medium = { productId: TEE.id, variantLabel: "M" };
const bag = { productId: BAG.id, variantLabel: undefined };

test("adds, merges and removes lines", () => {
  let cart = setQuantity([], small, 1, 5);
  cart = setQuantity(cart, small, 2, 5);
  assert.equal(cart.length, 1);
  assert.equal(quantityOf(cart, small), 2);
  assert.deepEqual(setQuantity(cart, small, 0, 5), []);
  assert.deepEqual(setQuantity(cart, small, -3, 5), []);
});

test("sizes of one product share its stock", () => {
  const cart = setQuantity(setQuantity([], small, 3, 5), medium, 9, 5);
  assert.equal(quantityOf(cart, medium), 2);
  assert.equal(maxQuantity(cart, medium, 5), 2);
});

test("caps a line at 10 and refuses sold-out products", () => {
  assert.equal(quantityOf(setQuantity([], bag, 99, 100), bag), 10);
  assert.deepEqual(setQuantity([], bag, 1, 0), []);
});

test("survives broken, tampered or empty storage", () => {
  for (const raw of [null, "", "{", "null", "{}", '[{"productId":"x","quantity":1}]', `[{"productId":"${TEE.id}","quantity":-1}]`, `[{"productId":"${TEE.id}","quantity":1.5}]`]) {
    assert.deepEqual(parseCart(raw), [], String(raw));
  }
  const cart = setQuantity([], small, 2, 5);
  assert.equal(quantityOf(parseCart(JSON.stringify(cart)), small), 2);
});

test("reconcile drops missing products and bad sizes, and caps low stock", () => {
  const saved = [
    { ...small, quantity: 9 },
    { productId: TEE.id, variantLabel: "XXXL", quantity: 1 },
    { productId: TEE.id, quantity: 1 },
    { ...bag, variantLabel: "S", quantity: 1 },
    { productId: "7f1c2a40-0009-4c6e-9a10-000000000009", quantity: 1 },
  ];
  assert.deepEqual(reconcile(saved, [TEE, BAG]), [{ ...small, quantity: 5 }]);
});

test("totals are whole rupiah", () => {
  const cart = setQuantity(setQuantity([], small, 2, 5), bag, 1, 100);
  assert.equal(cartTotalIdr(cart, [TEE, BAG]), 255000);
  assert.equal(cartTotalIdr([], [TEE]), 0);
});
