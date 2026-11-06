import { ProductCategorySchema, type ProductCategory } from "@/lib/contracts";

export const LOW_STOCK_THRESHOLD = 5;

export const CATEGORY_FILTERS: { label: string; value: ProductCategory | null }[] = [
  { label: "All", value: null },
  { label: "Merch", value: "MERCH" },
  { label: "Food and drinks", value: "FNB" },
  { label: "Bundles", value: "BUNDLE" },
];

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(amountIdr: number): string {
  return rupiah.format(amountIdr);
}

export function parseCategory(raw: string | string[] | undefined): ProductCategory | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = ProductCategorySchema.safeParse(value?.toUpperCase());
  return parsed.success ? parsed.data : null;
}

export function categoryHref(category: ProductCategory | null): string {
  return category ? `/marketplace?category=${category.toLowerCase()}` : "/marketplace";
}

export type StockLevel = "IN_STOCK" | "LOW" | "SOLD_OUT";

export function stockLevel(stockAvailable: number): StockLevel {
  if (stockAvailable <= 0) return "SOLD_OUT";
  if (stockAvailable <= LOW_STOCK_THRESHOLD) return "LOW";
  return "IN_STOCK";
}
