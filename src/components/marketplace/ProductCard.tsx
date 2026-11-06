import Image from "next/image";
import { Gift, Shirt, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { ProductCategory, ProductSummary } from "@/lib/contracts";
import { formatRupiah, stockLevel } from "./catalog";
import { StockBadge } from "./StockBadge";

const CATEGORY_ICON: Record<ProductCategory, LucideIcon> = {
  MERCH: Shirt,
  FNB: UtensilsCrossed,
  BUNDLE: Gift,
};

const MAX_VARIANT_CHIPS = 4;

export function ProductCard({ product }: { product: ProductSummary }) {
  const soldOut = stockLevel(product.stockAvailable) === "SOLD_OUT";
  const Icon = CATEGORY_ICON[product.category];
  const shownVariants = product.variantLabels.slice(0, MAX_VARIANT_CHIPS);
  const hiddenVariantCount = product.variantLabels.length - shownVariants.length;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-leaf bg-surface shadow-card">
      <div className={`relative aspect-square bg-leaf-soft ${soldOut ? "opacity-60" : ""}`}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-forest" aria-hidden="true">
            <Icon size={48} strokeWidth={1.75} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h2 className="text-[15px] leading-snug font-bold text-ink sm:text-base">{product.name}</h2>
        <p className="text-base font-extrabold text-ink tabular-nums">{formatRupiah(product.priceIdr)}</p>

        {shownVariants.length > 0 && (
          <ul aria-label="Available options" className="flex flex-wrap gap-1">
            {shownVariants.map((variant) => (
              <li
                key={variant}
                className="rounded-full border border-line px-2 py-0.5 text-xs font-semibold text-ink-2"
              >
                {variant}
              </li>
            ))}
            {hiddenVariantCount > 0 && (
              <li className="px-1 py-0.5 text-xs font-semibold text-ink-muted">+{hiddenVariantCount}</li>
            )}
          </ul>
        )}

        <div className="mt-auto pt-1">
          <StockBadge stockAvailable={product.stockAvailable} />
        </div>
      </div>
    </article>
  );
}
