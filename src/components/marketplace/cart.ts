import { z } from "zod";
import type { ProductSummary } from "@/lib/contracts";

export const MAX_PER_LINE = 10;

const CartItemSchema = z.object({
  productId: z.uuid(),
  variantLabel: z.string().optional(),
  quantity: z.number().int().min(1).max(MAX_PER_LINE),
});
export type CartItem = z.infer<typeof CartItemSchema>;
export type CartLine = Pick<CartItem, "productId" | "variantLabel">;

export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = z.array(CartItemSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function sameLine(a: CartLine, b: CartLine): boolean {
  return a.productId === b.productId && a.variantLabel === b.variantLabel;
}

// Stock is counted per product, so every size of one product shares the same limit.
export function maxQuantity(cart: CartItem[], line: CartLine, stockAvailable: number): number {
  const otherSizes = cart
    .filter((item) => item.productId === line.productId && !sameLine(item, line))
    .reduce((sum, item) => sum + item.quantity, 0);
  return Math.max(0, Math.min(MAX_PER_LINE, stockAvailable - otherSizes));
}

export function setQuantity(cart: CartItem[], line: CartLine, quantity: number, stockAvailable: number): CartItem[] {
  const allowed = Math.min(quantity, maxQuantity(cart, line, stockAvailable));
  if (allowed <= 0) return cart.filter((item) => !sameLine(item, line));
  if (!cart.some((item) => sameLine(item, line))) {
    return [...cart, { productId: line.productId, variantLabel: line.variantLabel, quantity: allowed }];
  }
  return cart.map((item) => (sameLine(item, line) ? { ...item, quantity: allowed } : item));
}

export function quantityOf(cart: CartItem[], line: CartLine): number {
  return cart.find((item) => sameLine(item, line))?.quantity ?? 0;
}

// A saved cart can be older than the catalog: drop what is gone and cap what is short.
export function reconcile(cart: CartItem[], products: ProductSummary[]): CartItem[] {
  return cart.reduce<CartItem[]>((kept, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) return kept;
    const variantIsValid = product.variantLabels.length
      ? item.variantLabel !== undefined && product.variantLabels.includes(item.variantLabel)
      : item.variantLabel === undefined;
    return variantIsValid ? setQuantity(kept, item, item.quantity, product.stockAvailable) : kept;
  }, []);
}

export function cartTotalIdr(cart: CartItem[], products: ProductSummary[]): number {
  return cart.reduce((sum, item) => {
    const price = products.find((product) => product.id === item.productId)?.priceIdr ?? 0;
    return sum + price * item.quantity;
  }, 0);
}
