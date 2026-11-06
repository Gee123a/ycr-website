import type { Metadata } from "next";
import { Suspense } from "react";
import { Info } from "lucide-react";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { ProductGrid, ProductGridSkeleton } from "@/components/marketplace/ProductGrid";
import { parseCategory } from "@/components/marketplace/catalog";
import { getMarketplaceProducts } from "./mock-products";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Official YCR \"The Highway\" merch, food and bundles.",
};

export default function MarketplacePage({ searchParams }: PageProps<"/marketplace">) {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="display-title text-[32px] leading-9 sm:text-[40px] sm:leading-11">YCR Marketplace</h1>
        <p className="max-w-xl text-ink-2">
          Official merch, food and bundles for The Highway. Every purchase helps the event happen.
        </p>
      </header>

      <p className="flex items-start gap-2 rounded-xl bg-sun-soft px-4 py-3 text-sm text-ink">
        <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
        Preview: these are sample products and prices while the shop is being built.
      </p>

      <Suspense fallback={<ProductGridSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/marketplace">, "searchParams">) {
  const category = parseCategory((await searchParams).category);
  const products = await getMarketplaceProducts(category);

  return (
    <div className="flex flex-col gap-5">
      <CategoryFilter active={category} />
      <ProductGrid products={products} />
    </div>
  );
}
