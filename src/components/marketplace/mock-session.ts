import type { CheckoutSessionResponse, OrderType, PaidMethod } from "@/lib/contracts";

const SAMPLE_QR = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fff"/><rect x="10" y="10" width="180" height="180" fill="none" stroke="#3b2a14" stroke-width="4" stroke-dasharray="12 8"/><text x="100" y="96" font-family="sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#3b2a14">SAMPLE</text><text x="100" y="122" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#3b2a14">not a real QRIS</text></svg>',
)}`;

// A fake QR or account number must never reach a real buyer, so the mock only answers in development.
export const isMockCheckoutOpen = process.env.NODE_ENV === "development";

// Stands in for Keane's payment service until DV07.
export function mockCheckoutSession(
  orderType: OrderType,
  amountTotalIdr: number,
  paymentMethod: PaidMethod,
): CheckoutSessionResponse {
  return {
    orderCode: `YCR-2026-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
    orderType,
    paymentStatus: "PENDING",
    amountTotalIdr,
    paymentMethod,
    ...(paymentMethod === "QRIS" ? { qrImageUrl: SAMPLE_QR } : { vaNumber: "0000000000000000" }),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}
