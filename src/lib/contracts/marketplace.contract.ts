import { z } from "zod";
import { PaidMethodSchema, WhatsappSchema } from "./common.contract";

export const ProductCategorySchema = z.enum(["MERCH", "FNB", "BUNDLE"]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  priceIdr: number;
  stockAvailable: number;
  imageUrl: string | null;
  variantLabels: string[];
}

export const CreateMarketplaceOrderSchema = z.object({
  buyerName: z.string().min(3).max(100),
  buyerEmail: z.email(),
  buyerWhatsapp: WhatsappSchema,
  paymentMethod: PaidMethodSchema,
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        variantLabel: z.string().optional(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
});
export type CreateMarketplaceOrderInput = z.infer<typeof CreateMarketplaceOrderSchema>;
