import { stockLevel } from "./catalog";

export function StockBadge({ stockAvailable }: { stockAvailable: number }) {
  const level = stockLevel(stockAvailable);

  if (level === "SOLD_OUT") {
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink-2">
        Sold out
      </span>
    );
  }

  if (level === "LOW") {
    return (
      <span className="inline-flex items-center rounded-full bg-sun-soft px-2.5 py-0.5 text-xs font-semibold text-ink">
        Only {stockAvailable} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-leaf-soft px-2.5 py-0.5 text-xs font-semibold text-forest-ink">
      In stock
    </span>
  );
}
