"use server";

import type { z } from "zod";
import type { CheckoutResult } from "@/components/marketplace/checkout";
import { isMockCheckoutOpen, mockCheckoutSession } from "@/components/marketplace/mock-session";
import { registrationMode, ycrPrice, type RegistrationMode } from "@/components/registration/pricing";
import { PRICE_WEBINAR_IDR } from "@/lib/constants";
import {
  CreateWebinarRegistrationSchema,
  CreateYcrGroupSchema,
  CreateYcrRegistrationSchema,
  type CreateWebinarRegistrationInput,
  type CreateYcrGroupInput,
  type CreateYcrRegistrationInput,
  type PaidMethod,
} from "@/lib/contracts";

// Same inputs and output as the real registration services, so wiring up only changes the imports.
async function mockRegister<Input extends { paymentMethod: PaidMethod }>(
  mode: RegistrationMode,
  schema: z.ZodType<Input>,
  input: Input,
  totalIdr: (input: Input) => number,
): Promise<CheckoutResult> {
  if (!isMockCheckoutOpen) return { ok: false, message: "Registration isn't open yet. Come back soon." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Check your details and try again." };

  // The form follows the visitor's clock, which can be wrong.
  if (registrationMode(Date.now()) !== mode) {
    return { ok: false, message: "This registration isn't open right now. Reload the page to see the current one." };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ok: true, session: mockCheckoutSession("EVENT_TICKET", totalIdr(parsed.data), parsed.data.paymentMethod) };
}

export async function registerWebinar(input: CreateWebinarRegistrationInput): Promise<CheckoutResult> {
  return mockRegister("webinar", CreateWebinarRegistrationSchema, input, () => PRICE_WEBINAR_IDR);
}

export async function registerYcr(input: CreateYcrRegistrationInput): Promise<CheckoutResult> {
  return mockRegister("ycr", CreateYcrRegistrationSchema, input, () => ycrPrice(1).totalIdr);
}

export async function registerYcrGroup(input: CreateYcrGroupInput): Promise<CheckoutResult> {
  return mockRegister("ycr", CreateYcrGroupSchema, input, ({ members }) => ycrPrice(members.length).totalIdr);
}
