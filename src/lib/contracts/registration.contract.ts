import { z } from "zod";
import { PaidMethodSchema, WhatsappSchema } from "./common.contract";

export const MemberSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.email(),
  whatsapp: WhatsappSchema,
  nimOrInstitution: z.string().max(100).optional(),
});
export type Member = z.infer<typeof MemberSchema>;

// Webinar: paid, individual only
export const CreateWebinarRegistrationSchema = z.object({
  member: MemberSchema,
  paymentMethod: PaidMethodSchema,
});
export type CreateWebinarRegistrationInput = z.infer<typeof CreateWebinarRegistrationSchema>;

// YCR individual: paid
export const CreateYcrRegistrationSchema = z.object({
  member: MemberSchema,
  paymentMethod: PaidMethodSchema,
});
export type CreateYcrRegistrationInput = z.infer<typeof CreateYcrRegistrationSchema>;

// YCR group: paid, the leader is members[0]
export const CreateYcrGroupSchema = z.object({
  members: z.array(MemberSchema).min(1),
  paymentMethod: PaidMethodSchema,
});
export type CreateYcrGroupInput = z.infer<typeof CreateYcrGroupSchema>;
