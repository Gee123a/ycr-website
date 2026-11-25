import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const EMBLEMS = [
  { initials: "UC", label: "Universitas Ciputra Emblem" },
  { initials: "KMK", label: "KMK Emblem" },
  { initials: "YCR", label: "The Highway Emblem" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-xl pr-2"
        >
          <div className="flex items-center gap-1.5" aria-label="Brand emblems">
            {EMBLEMS.map((emblem) => (
              <span
                key={emblem.initials}
                title={`${emblem.label} (placeholder)`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-line-strong bg-surface text-[10px] font-extrabold text-ink-2"
              >
                {emblem.initials}
              </span>
            ))}
          </div>
          <span className="text-sm font-extrabold tracking-tight text-ink sm:text-base">
            YCR · The Highway
          </span>
        </Link>

        <nav aria-label="Primary Navigation" className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-bold text-ink-2 hover:bg-surface hover:text-ink"
          >
            Event
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 text-sm font-extrabold text-ink hover:bg-sun-soft"
          >
            <ShoppingBag className="h-4 w-4 text-forest" />
            <span>Merch</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
