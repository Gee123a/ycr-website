import { formatRupiah } from "@/components/marketplace/catalog";
import { PRICE_YCR_INDIVIDUAL_IDR } from "@/lib/constants";
import { ycrPrice } from "./pricing";

export function PriceSummary({ people }: { people: number }) {
  const { subtotalIdr, discountRate, discountIdr, perPersonIdr, totalIdr } = ycrPrice(people);

  return (
    <dl aria-live="polite" className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 tabular-nums">
      <div className="flex justify-between gap-3">
        <dt className="text-ink-2">
          {people} {people === 1 ? "person" : "people"} at {formatRupiah(PRICE_YCR_INDIVIDUAL_IDR)}
        </dt>
        <dd>{formatRupiah(subtotalIdr)}</dd>
      </div>
      {discountIdr > 0 && (
        <div className="flex justify-between gap-3 text-forest-ink">
          <dt>Group discount, {Math.round(discountRate * 100)}%</dt>
          <dd>-{formatRupiah(discountIdr)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2">
        <dt className="font-bold">Total</dt>
        <dd className="text-right">
          <span className="block text-xl font-extrabold">{formatRupiah(totalIdr)}</span>
          {discountIdr > 0 && <span className="text-sm text-ink-2">{formatRupiah(perPersonIdr)} per person</span>}
        </dd>
      </div>
    </dl>
  );
}
