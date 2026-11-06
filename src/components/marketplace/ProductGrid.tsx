import Link from "next/link";
import { PackageOpen } from "lucide-react";
import type { ProductSummary } from "@/lib/contracts";
import { ProductCard } from "./ProductCard";

const GRID_CLASSES = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-leaf bg-surface px-6 py-12 text-center shadow-card">
        <PackageOpen size={40} strokeWidth={1.75} className="text-forest" aria-hidden="true" />
        <h2 className="text-xl font-extrabold">Nothing here yet</h2>
        <p className="max-w-sm text-sm text-ink-2">This category has no products right now. Check back soon or browse everything.</p>
        <Link
          href="/marketplace"
          className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-forest px-5 font-bold text-forest-ink"
        >
          See all products
        </Link>
      </div>
    );
  }

  return (
    <ul className={GRID_CLASSES}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products" className="flex flex-col gap-5">
      <div className="flex gap-2">
        {[64, 72, 132, 88].map((width) => (
          <div key={width} className="h-11 animate-pulse rounded-full bg-line" style={{ width }} />
        ))}
      </div>
      <div className={GRID_CLASSES}>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-leaf bg-surface shadow-card">
            <div className="aspect-square animate-pulse bg-line" />
            <div className="flex flex-col gap-2 p-3 sm:p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-line" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
