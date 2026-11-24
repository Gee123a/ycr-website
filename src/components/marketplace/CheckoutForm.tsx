"use client";

import { useState, useTransition, type FormEvent } from "react";
import { z } from "zod";
import {
  CreateMarketplaceOrderSchema,
  type CheckoutSessionResponse,
  type CreateMarketplaceOrderInput,
} from "@/lib/contracts";
import type { CartItem } from "./cart";
import { cleanWhatsapp, focusFirstError, type CheckoutResult } from "./checkout";
import { Field } from "./Field";
import { PaymentMethodField } from "./PaymentMethodField";

const MESSAGES: Partial<Record<keyof CreateMarketplaceOrderInput, string>> = {
  buyerName: "Enter your full name, 3 to 100 letters.",
  buyerEmail: "Enter an email like name@email.com.",
  buyerWhatsapp: "Enter an Indonesian number like 0812 3456 7890.",
};

export function CheckoutForm({
  items,
  checkout,
  onSession,
}: {
  items: CartItem[];
  checkout: (input: CreateMarketplaceOrderInput) => Promise<CheckoutResult>;
  onSession: (session: CheckoutSessionResponse) => void;
}) {
  const [errors, setErrors] = useState<typeof MESSAGES>({});
  const [failure, setFailure] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = CreateMarketplaceOrderSchema.safeParse({
      buyerName: String(data.get("buyerName")).trim(),
      buyerEmail: String(data.get("buyerEmail")).trim(),
      buyerWhatsapp: cleanWhatsapp(String(data.get("buyerWhatsapp"))),
      paymentMethod: data.get("paymentMethod"),
      items,
    });
    setFailure("");
    if (!parsed.success) {
      const invalid = z.flattenError(parsed.error).fieldErrors;
      setErrors(Object.fromEntries(Object.entries(MESSAGES).filter(([name]) => name in invalid)));
      focusFirstError(form);
      return;
    }
    setErrors({});
    startTransition(async () => {
      try {
        const result = await checkout(parsed.data);
        if (result.ok) onSession(result.session);
        else setFailure(result.message);
      } catch {
        setFailure("We couldn't reach the server. Check your connection and try again.");
      }
    });
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-4">
      <h3 className="text-[17px] font-bold">Your details</h3>
      <Field label="Full name" name="buyerName" autoComplete="name" placeholder="Maria Santoso" error={errors.buyerName} />
      <Field
        label="Email"
        name="buyerEmail"
        type="email"
        autoComplete="email"
        placeholder="name@email.com"
        error={errors.buyerEmail}
      />
      <Field
        label="WhatsApp number"
        name="buyerWhatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0812 3456 7890"
        error={errors.buyerWhatsapp}
      />
      <PaymentMethodField />
      {failure && (
        <p role="alert" className="rounded-xl bg-berry-soft px-4 py-3 text-sm text-berry-ink">
          {failure}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-road px-6 font-extrabold text-on-road hover:bg-road-hover disabled:opacity-70"
      >
        {isPending ? "Creating your order…" : "Check out"}
      </button>
    </form>
  );
}
