import { z } from "zod";
import { EventSlugSchema, PaidMethodSchema, WhatsappSchema } from "./common.contract";

export const CreateRegistrationSchema = z.object({
  eventSlug: EventSlugSchema,
  ticketTierId: z.uuid(),
  fullName: z.string().min(3).max(100),
  nimOrInstitution: z.string().min(2).max(100),
  email: z.email(),
  whatsapp: WhatsappSchema,
  paymentMethod: z.union([z.literal("FREE"), PaidMethodSchema]),
});
export type CreateRegistrationInput = z.infer<typeof CreateRegistrationSchema>;
