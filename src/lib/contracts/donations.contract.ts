import { z } from "zod";
import { PaidMethodSchema, WhatsappSchema } from "./common.contract";

export const DonationCampaignSchema = z.enum(["ycr", "baksos"]);
export type DonationCampaign = z.infer<typeof DonationCampaignSchema>;

// Minimum amount is still an open decision (Gee / committee); Keane enforces DONATION_MIN_IDR once set.
export const CreateDonationSchema = z.object({
  campaign: DonationCampaignSchema,
  amountIdr: z.number().int().positive(),
  donorName: z.string().min(3).max(100),
  donorEmail: z.email(),
  donorWhatsapp: WhatsappSchema,
  isAnonymous: z.boolean().default(false),
  message: z.string().max(280).optional(),
  paymentMethod: PaidMethodSchema,
});
export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;
