/**
 * Single source of truth for event dates, pricing, and group discount tiers.
 * Update placeholder timestamps before production launch.
 */

export const YCR_OPENS_AT = Date.parse("2026-12-01T00:00:00+07:00");
export const YCR_DATE_MIDNIGHT = Date.parse("2027-01-24T00:00:00+07:00");

export const PRICE_WEBINAR_IDR = 50_000;
export const PRICE_YCR_INDIVIDUAL_IDR = 150_000;

export const DISCOUNT_TIER_5 = 0.10;
export const DISCOUNT_TIER_10 = 0.20;
