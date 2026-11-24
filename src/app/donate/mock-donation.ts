"use server";

import type { CheckoutResult } from "@/components/marketplace/checkout";
import { isMockCheckoutOpen, mockCheckoutSession } from "@/components/marketplace/mock-session";
import { CreateDonationSchema, type CreateDonationInput } from "@/lib/contracts";

// Same input and output as Keane's donation service, so DV07 only changes the import.
export async function createDonation(input: CreateDonationInput): Promise<CheckoutResult> {
  if (!isMockCheckoutOpen) return { ok: false, message: "Donations aren't open yet. Come back soon." };

  const parsed = CreateDonationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Check your details and try again." };

  return { ok: true, session: mockCheckoutSession("DONATION", parsed.data.amountIdr, parsed.data.paymentMethod) };
}
