import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-8 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="font-extrabold text-ink">
            UKM Keluarga Mahasiswa Katolik (KMK) — Universitas Ciputra
          </p>
          <p className="text-xs text-ink-muted">
            Youth Catholic Revival &ldquo;The Highway&rdquo; · CitraLand CBD Boulevard, Surabaya
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center px-2 font-bold text-ink-2 hover:text-ink"
          >
            Home
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex min-h-11 items-center px-2 font-bold text-ink-2 hover:text-ink"
          >
            Marketplace
          </Link>
          <span className="rounded-full border border-dashed border-line-strong px-3 py-1 text-xs font-semibold text-ink-muted">
            @kmk_uc (IG Placeholder)
          </span>
        </div>
      </div>
    </footer>
  );
}
