import { DISCOUNT_TIER_10, DISCOUNT_TIER_5, PRICE_YCR_INDIVIDUAL_IDR, YCR_OPENS_AT } from "@/lib/constants";

export type RegistrationMode = "webinar" | "ycr";

export function registrationMode(nowMs: number): RegistrationMode {
  return nowMs < YCR_OPENS_AT ? "webinar" : "ycr";
}

export interface YcrPrice {
  subtotalIdr: number;
  discountRate: number;
  discountIdr: number;
  perPersonIdr: number;
  totalIdr: number;
}

export function ycrPrice(people: number): YcrPrice {
  const discountRate = people >= 10 ? DISCOUNT_TIER_10 : people >= 5 ? DISCOUNT_TIER_5 : 0;
  const perPersonIdr = Math.round(PRICE_YCR_INDIVIDUAL_IDR * (1 - discountRate));
  const subtotalIdr = PRICE_YCR_INDIVIDUAL_IDR * people;
  const totalIdr = perPersonIdr * people;
  return { subtotalIdr, discountRate, discountIdr: subtotalIdr - totalIdr, perPersonIdr, totalIdr };
}
