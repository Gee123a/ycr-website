import type { CheckoutSessionResponse, PaidMethod } from "@/lib/contracts";

export type CheckoutResult = { ok: true; session: CheckoutSessionResponse } | { ok: false; message: string };

export const PAYMENT_METHOD_LABELS: Record<PaidMethod, string> = {
  QRIS: "QRIS (any bank or e-wallet)",
  BCAVA: "BCA Virtual Account",
  BRIVA: "BRI Virtual Account",
  BNIVA: "BNI Virtual Account",
  MANDIRIVA: "Mandiri Virtual Account",
};

// People type 0812-3456-7890 or 0812 3456 7890; the contract only accepts digits.
export function cleanWhatsapp(raw: string): string {
  return raw.replace(/[\s()-]/g, "");
}

export function focusFirstError(form: HTMLFormElement) {
  requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
}
