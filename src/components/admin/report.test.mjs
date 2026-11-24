import assert from "node:assert/strict";
import { test } from "node:test";
import { dashboardTotals, filterOrders, filterParticipants, toCsv } from "./report.ts";

const person = (over) => ({
  fullName: "Maria Santoso", eventSlug: "ycr", tierName: "Regular", paymentStatus: "PAID", ticketCode: "YCR-T-0001", checkedInAt: null, ...over,
});
const order = (over) => ({
  orderCode: "YCR-2026-AAAA", buyerName: "Budi", amountTotalIdr: 100000, paymentStatus: "PAID", merchQuantity: 0, donationCampaign: null, ...over,
});

test("only paid rows count toward totals", () => {
  const totals = dashboardTotals({
    participants: [person(), person({ tierName: "VIP", checkedInAt: "2026-12-20T02:00:00Z" }), person({ paymentStatus: "PENDING", ticketCode: null })],
    orders: [
      order({ merchQuantity: 2 }),
      order({ donationCampaign: "baksos", amountTotalIdr: 50000 }),
      order({ donationCampaign: "baksos", amountTotalIdr: 25000 }),
      order({ paymentStatus: "EXPIRED", merchQuantity: 9, donationCampaign: "ycr" }),
    ],
  });
  assert.deepEqual(totals, {
    revenueIdr: 175000,
    merchSold: 2,
    registrations: 3,
    paidRegistrations: 2,
    checkedIn: 1,
    ticketsByTier: [["YCR Regular", 1], ["YCR VIP", 1]],
    donationsByCampaign: [["BAKSOS", 75000]],
  });
});

test("no data gives zeroes", () => {
  const totals = dashboardTotals({ participants: [], orders: [] });
  assert.equal(totals.revenueIdr, 0);
  assert.deepEqual(totals.ticketsByTier, []);
});

test("search ignores case and spaces, and combines with status", () => {
  const people = [person(), person({ fullName: "Andreas", ticketCode: null, paymentStatus: "PENDING" })];
  assert.equal(filterParticipants(people, "  MARIA ", "ALL").length, 1);
  assert.equal(filterParticipants(people, "t-0001", "ALL").length, 1);
  assert.equal(filterParticipants(people, "", "ALL").length, 2);
  assert.equal(filterParticipants(people, "", "PENDING").length, 1);
  assert.equal(filterParticipants(people, "maria", "PENDING").length, 0);
  assert.equal(filterOrders([order()], "2026-aaaa", "PAID").length, 1);
});

test("CSV escapes quotes, commas and line breaks", () => {
  assert.equal(toCsv(["a", "b"], [['say "hi"', "x,y"], ["two\nlines", null]]), 'a,b\r\n"say ""hi""","x,y"\r\n"two\nlines",');
});

test("CSV never lets a name run as a spreadsheet formula", () => {
  assert.equal(toCsv(["n"], [["=1+1"], ["@cmd"], ["-2"], ["+62812"], [-5]]), "n\r\n'=1+1\r\n'@cmd\r\n'-2\r\n'+62812\r\n-5");
});
