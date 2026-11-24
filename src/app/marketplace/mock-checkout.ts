"use server";

import { cartTotalIdr, quantityOf, reconcile } from "@/components/marketplace/cart";
import type { CheckoutResult } from "@/components/marketplace/checkout";
import { isMockCheckoutOpen, mockCheckoutSession } from "@/components/marketplace/mock-session";
import { CreateMarketplaceOrderSchema, type CreateMarketplaceOrderInput } from "@/lib/contracts";
import { getMarketplaceProducts } from "./mock-products";

// Same input and output as Keane's order service, so DV07 only changes the import.
export async function createMarketplaceOrder(input: CreateMarketplaceOrderInput): Promise<CheckoutResult> {
  if (!isMockCheckoutOpen) return { ok: false, message: "Checkout isn't open yet. Come back soon." };

  const parsed = CreateMarketplaceOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Check your details and try again." };

  const { items, paymentMethod } = parsed.data;
  const products = await getMarketplaceProducts(null);
  const available = reconcile(items, products);
  const hasChanged =
    available.length !== items.length || items.some((item) => quantityOf(available, item) !== item.quantity);
  if (hasChanged) return { ok: false, message: "Some items just sold out. Reload the page to see what's left." };

  return { ok: true, session: mockCheckoutSession("MARKETPLACE", cartTotalIdr(items, products), paymentMethod) };
}
