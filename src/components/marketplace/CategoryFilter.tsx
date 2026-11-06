import Link from "next/link";
import type { ProductCategory } from "@/lib/contracts";
import { CATEGORY_FILTERS, categoryHref } from "./catalog";

export function CategoryFilter({ active }: { active: ProductCategory | null }) {
  return (
    <nav aria-label="Product categories" className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-2">
        {CATEGORY_FILTERS.map((filter) => {
          const isActive = filter.value === active;
          return (
            <li key={filter.label}>
              <Link
                href={categoryHref(filter.value)}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={
                  isActive
                    ? "inline-flex min-h-11 items-center rounded-full bg-forest px-4 text-sm font-bold text-on-forest"
                    : "inline-flex min-h-11 items-center rounded-full border-[1.5px] border-line-strong bg-surface px-4 text-sm font-bold text-ink-2 transition-colors hover:border-forest hover:text-forest-ink"
                }
              >
                {filter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
