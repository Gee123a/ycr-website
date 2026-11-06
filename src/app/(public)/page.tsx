import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col items-start justify-center gap-6 px-4 py-16 sm:px-6">
      <h1 className="display-title text-[44px] leading-[46px] sm:text-[56px] sm:leading-[58px]">
        Welcome to
        <br />
        The Highway
      </h1>
      <p className="max-w-xl text-lg text-ink-2">
        Youth Catholic Revival by KMK Universitas Ciputra. The full landing page is coming soon.
      </p>
      <Link
        href="/marketplace"
        className="inline-flex min-h-12 items-center rounded-full bg-road px-6 font-extrabold text-on-road transition-colors hover:bg-road-hover"
      >
        Visit the marketplace
      </Link>
    </main>
  );
}
