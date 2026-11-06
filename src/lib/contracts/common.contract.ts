import { z } from "zod";

export const EventSlugSchema = z.enum(["ycr", "heart", "ziarah", "baksos"]);
export type EventSlug = z.infer<typeof EventSlugSchema>;

export const WhatsappSchema = z
  .string()
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, "Invalid Indonesian WhatsApp number");

export const PaidMethodSchema = z.enum(["QRIS", "BCAVA", "BRIVA", "BNIVA", "MANDIRIVA"]);
export type PaidMethod = z.infer<typeof PaidMethodSchema>;
