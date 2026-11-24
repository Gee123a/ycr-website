"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { z } from "zod";
import {
  CreateDonationSchema,
  type CheckoutSessionResponse,
  type CreateDonationInput,
  type DonationCampaign,
} from "@/lib/contracts";
import { formatRupiah } from "@/components/marketplace/catalog";
import { cleanWhatsapp, focusFirstError, type CheckoutResult } from "@/components/marketplace/checkout";
import { CONTROL_CLASSES, Field, FieldError } from "@/components/marketplace/Field";
import { PaymentMethodField } from "@/components/marketplace/PaymentMethodField";
import { PaymentModal } from "@/components/marketplace/PaymentModal";
import { parseRupiah } from "./amount";

const CAMPAIGNS: { value: DonationCampaign; label: string }[] = [
  { value: "ycr", label: "YCR" },
  { value: "baksos", label: "Baksos" },
];
const PRESET_AMOUNTS = [25000, 50000, 100000];
const MESSAGE_LIMIT = 280;

const MESSAGES: Partial<Record<keyof CreateDonationInput, string>> = {
  amountIdr: "Enter a whole amount like 75.000.",
  donorName: "Enter your full name, 3 to 100 letters.",
  donorEmail: "Enter an email like name@email.com.",
  donorWhatsapp: "Enter an Indonesian number like 0812 3456 7890.",
  message: `Keep your message under ${MESSAGE_LIMIT} characters.`,
};

const PILL =
  "relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-line-strong bg-surface px-4 text-center font-bold text-ink-2 has-checked:border-forest has-checked:bg-forest has-checked:text-on-forest has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus";

export function DonationForm({
  defaultCampaign,
  donate,
}: {
  defaultCampaign: DonationCampaign;
  donate: (input: CreateDonationInput) => Promise<CheckoutResult>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<typeof MESSAGES>({});
  const [failure, setFailure] = useState("");
  const [session, setSession] = useState<CheckoutSessionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const parsed = CreateDonationSchema.safeParse({
      campaign: data.get("campaign"),
      amountIdr: data.get("amount") === "custom" ? parseRupiah(text("customAmount")) : Number(data.get("amount")),
      donorName: text("donorName"),
      donorEmail: text("donorEmail"),
      donorWhatsapp: cleanWhatsapp(text("donorWhatsapp")),
      isAnonymous: data.has("isAnonymous"),
      message: text("message") || undefined,
      paymentMethod: data.get("paymentMethod"),
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
        const result = await donate(parsed.data);
        if (result.ok) setSession(result.session);
        else setFailure(result.message);
      } catch {
        setFailure("We couldn't reach the server. Check your connection and try again.");
      }
    });
  }

  return (
    <>
      <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-6">
        <fieldset>
          <legend className="pb-2 text-[17px] font-bold">Where should it go?</legend>
          <div className="grid grid-cols-2 gap-2">
            {CAMPAIGNS.map((campaign) => (
              <label key={campaign.value} className={PILL}>
                <input
                  type="radio"
                  name="campaign"
                  value={campaign.value}
                  defaultChecked={campaign.value === defaultCampaign}
                  className="sr-only"
                />
                {campaign.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="group">
          <legend className="pb-2 text-[17px] font-bold">How much?</legend>
          <div className="grid grid-cols-2 gap-2 tabular-nums sm:grid-cols-4">
            {PRESET_AMOUNTS.map((amount, index) => (
              <label key={amount} className={PILL}>
                <input type="radio" name="amount" value={amount} defaultChecked={index === 1} className="sr-only" />
                {formatRupiah(amount)}
              </label>
            ))}
            <label className={PILL}>
              <input type="radio" name="amount" value="custom" className="sr-only" />
              Custom
            </label>
          </div>
          <div className="hidden pt-3 group-has-[[value=custom]:checked]:block">
            <Field
              label="Custom amount (Rp)"
              name="customAmount"
              inputMode="numeric"
              placeholder="75.000"
              autoComplete="off"
              error={errors.amountIdr}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <h2 className="text-[17px] font-bold">Your details</h2>
          <Field label="Full name" name="donorName" autoComplete="name" placeholder="Maria Santoso" error={errors.donorName} />
          <Field
            label="Email"
            name="donorEmail"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            error={errors.donorEmail}
          />
          <Field
            label="WhatsApp number"
            name="donorWhatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0812 3456 7890"
            error={errors.donorWhatsapp}
          />
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" name="isAnonymous" className="size-5 shrink-0 accent-forest" />
            Give anonymously. Only the committee sees your name.
          </label>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-bold">
              Prayer intention or message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              maxLength={MESSAGE_LIMIT}
              placeholder="For my family's health"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : "message-hint"}
              className={`${CONTROL_CLASSES} border-line-strong py-3`}
            />
            <p id="message-hint" className="text-sm text-ink-2">
              Up to {MESSAGE_LIMIT} characters.
            </p>
            <FieldError id="message-error" message={errors.message} />
          </div>
          <PaymentMethodField />
        </div>

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
          {isPending ? "Preparing your payment…" : "Donate"}
        </button>
      </form>

      {session && (
        <PaymentModal
          session={session}
          onClose={() => setSession(null)}
          onRetry={() => setSession(null)}
          onPaid={() => formRef.current?.reset()}
          paidMessage="Thank you for your gift. May God bless you on the road."
        />
      )}
    </>
  );
}
