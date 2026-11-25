/**
 * Event Date Boundaries
 */
export const YCR_OPENS_AT = new Date("2026-04-01T00:00:00+07:00");
export const YCR_DATE_MIDNIGHT = new Date("2026-05-16T00:00:00+07:00");

/**
 * Base Event Pricing (in IDR)
 * Both Webinar and YCR Individual are PAID registrations.
 */
export const PRICE_WEBINAR_IDR = 50_000;
export const PRICE_YCR_INDIVIDUAL_IDR = 150_000;

/**
 * YCR Group Volume Discount Tiers
 */
export const DISCOUNT_TIER_5 = 0.1; // 10% discount for 5–9 participants
export const DISCOUNT_TIER_10 = 0.2; // 20% discount for 10+ participants
