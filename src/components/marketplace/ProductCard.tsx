import Image from "next/image";
import { Gift, Shirt, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { ProductCategory, ProductSummary } from "@/lib/contracts";
import { AddToCart } from "./AddToCart";
import { formatRupiah, stockLevel } from "./catalog";
import { StockBadge } from "./StockBadge";

const CATEGORY_ICON: Record<ProductCategory, LucideIcon> = {
  MERCH: Shirt,
  FNB: UtensilsCrossed,
  BUNDLE: Gift,
};

export function ProductCard({ product }: { product: ProductSummary }) {
  const soldOut = stockLevel(product.stockAvailable) === "SOLD_OUT";
  const Icon = CATEGORY_ICON[product.category];

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
        <div>
          <StockBadge stockAvailable={product.stockAvailable} />
        </div>
        {!soldOut && (
          <div className="mt-auto pt-1">
            <AddToCart product={product} />
          </div>
        )}
      </div>
    </article>
  );
}
