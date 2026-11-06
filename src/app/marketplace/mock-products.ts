import type { ProductCategory, ProductSummary } from "@/lib/contracts";

// Sample data so the catalog can be built before Keane's orders service exists (DV07 swaps this out).
const MOCK_PRODUCTS: ProductSummary[] = [
  {
    id: "7f1c2a40-0001-4c6e-9a10-000000000001",
    slug: "highway-tee-forest",
    name: "The Highway T-shirt, forest green",
    category: "MERCH",
    priceIdr: 95000,
    stockAvailable: 42,
    imageUrl: null,
    variantLabels: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "7f1c2a40-0002-4c6e-9a10-000000000002",
    slug: "highway-tee-cream",
    name: "The Highway T-shirt, cream",
    category: "MERCH",
    priceIdr: 95000,
    stockAvailable: 3,
    imageUrl: null,
    variantLabels: ["S", "M", "L", "XL"],
  },
  {
    id: "7f1c2a40-0003-4c6e-9a10-000000000003",
    slug: "highway-totebag",
    name: "Canvas totebag",
    category: "MERCH",
    priceIdr: 65000,
    stockAvailable: 25,
    imageUrl: null,
    variantLabels: [],
  },
  {
    id: "7f1c2a40-0004-4c6e-9a10-000000000004",
    slug: "highway-lanyard",
    name: "Lanyard and ID holder",
    category: "MERCH",
    priceIdr: 30000,
    stockAvailable: 0,
    imageUrl: null,
    variantLabels: [],
  },
  {
    id: "7f1c2a40-0005-4c6e-9a10-000000000005",
    slug: "highway-sticker-pack",
    name: "Sticker pack (6 pcs)",
    category: "MERCH",
    priceIdr: 20000,
    stockAvailable: 120,
    imageUrl: null,
    variantLabels: [],
  },
  {
    id: "7f1c2a40-0006-4c6e-9a10-000000000006",
    slug: "event-day-lunch",
    name: "Event-day lunch box",
    category: "FNB",
    priceIdr: 35000,
    stockAvailable: 80,
    imageUrl: null,
    variantLabels: ["Chicken", "Vegetarian"],
  },
  {
    id: "7f1c2a40-0007-4c6e-9a10-000000000007",
    slug: "iced-coffee-snack",
    name: "Iced coffee and snack",
    category: "FNB",
    priceIdr: 28000,
    stockAvailable: 5,
    imageUrl: null,
    variantLabels: [],
  },
  {
    id: "7f1c2a40-0008-4c6e-9a10-000000000008",
    slug: "highway-starter-bundle",
    name: "Highway starter bundle (tee, totebag, lanyard)",
    category: "BUNDLE",
    priceIdr: 165000,
    stockAvailable: 12,
    imageUrl: null,
    variantLabels: ["S", "M", "L", "XL"],
  },
];

export async function getMarketplaceProducts(category: ProductCategory | null): Promise<ProductSummary[]> {
  return category ? MOCK_PRODUCTS.filter((product) => product.category === category) : MOCK_PRODUCTS;
}
