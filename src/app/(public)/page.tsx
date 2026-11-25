import Link from "next/link";
import { ArrowDown, ImageIcon, ShoppingBag, Ticket } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TimelineBar } from "@/components/timeline/TimelineBar";
import { MOCK_MILESTONES } from "@/components/timeline/mock-timeline";
import {
  DISCOUNT_TIER_10,
  DISCOUNT_TIER_5,
  PRICE_WEBINAR_IDR,
  PRICE_YCR_INDIVIDUAL_IDR,
  YCR_OPENS_AT,
} from "@/lib/constants";

function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function HomePage() {
  const isYcrOpen = Date.now() >= YCR_OPENS_AT;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <SiteHeader />
      <TimelineBar />

      <main className="flex-1">
        {/* Lofi Hero Section */}
        <section className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <span className="inline-flex items-center rounded-full border border-dashed border-line-strong bg-surface px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-2">
                Lofi Wireframe · Assets Pending
              </span>

              <h1 className="display-title text-[42px] leading-[46px] sm:text-[56px] sm:leading-[60px]">
                Welcome to
                <br />
                The Highway
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
                Youth Catholic Revival by UKM KMK Universitas Ciputra. A shared
                journey of faith, fellowship, and renewal through Baksos,
                Ziarah, Webinar, and YCR.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#register"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-road px-6 text-sm font-extrabold text-on-road transition-colors hover:bg-road-hover"
                >
                  <Ticket className="h-4 w-4" />
                  <span>{isYcrOpen ? "Register for YCR" : "Register for Webinar"}</span>
                  <ArrowDown className="h-4 w-4" />
                </a>

                <Link
                  href="/marketplace"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest bg-surface px-6 text-sm font-extrabold text-forest-ink transition-colors hover:bg-leaf-soft"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Official Merch Store</span>
                </Link>
              </div>
            </div>

            {/* Wireframe Hero Illustration Placeholder */}
            <div className="lg:col-span-5">
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-leaf border-2 border-dashed border-line-strong bg-surface p-6 text-center shadow-card">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-line-strong bg-sun-soft/60 text-ink-2">
                  <ImageIcon className="h-7 w-7" />
                </div>
                <p className="text-sm font-extrabold text-ink">
                  Hero Illustration Placeholder
                </p>
                <p className="max-w-xs text-xs leading-relaxed text-ink-muted">
                  Waiting on layered &ldquo;Sunlit Forest &amp; Winding Golden
                  Highway&rdquo; artwork from the design team (
                  <code>public/brand/</code>).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lofi Journey Overview Cards */}
        <section className="border-y border-line bg-surface/60 py-10">
          <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                  4-Step Journey
                </p>
                <h2 className="text-2xl font-extrabold text-ink">
                  The Road to YCR
                </h2>
              </div>
              <span className="text-xs font-semibold text-ink-muted">
                Wireframe event cards
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_MILESTONES.map((m, i) => (
                <div
                  key={m.id}
                  className="flex flex-col justify-between gap-3 rounded-leaf border border-dashed border-line-strong bg-surface p-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-ink-muted">
                        0{i + 1}
                      </span>
                      <span
                        className={[
                          "rounded-full px-2.5 py-0.5 text-[11px] font-extrabold",
                          m.state === "PAST"
                            ? "bg-leaf-soft text-forest-ink"
                            : m.state === "NOW"
                              ? "bg-sun-soft text-ink"
                              : "border border-line bg-canvas text-ink-2",
                        ].join(" ")}
                      >
                        {m.state}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-ink">
                      {m.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-ink-2">
                      {m.description}
                    </p>
                  </div>
                  <div className="h-16 rounded-xl border border-dashed border-line bg-canvas/80 p-2 text-[11px] font-semibold text-ink-muted">
                    [Event Photo / Icon Placeholder]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lofi Context-Aware Registration Wireframe */}
        <section
          id="register"
          className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6"
        >
          <div className="mx-auto max-w-2xl rounded-leaf border-2 border-dashed border-line-strong bg-surface p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-line pb-4">
              <div>
                <span className="inline-block rounded-full bg-sun-soft px-3 py-0.5 text-xs font-extrabold text-ink">
                  {isYcrOpen ? "Active Phase: YCR" : "Active Phase: Webinar"}
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-ink">
                  {isYcrOpen
                    ? "YCR — The Highway Registration"
                    : "Pre-Event Webinar Registration"}
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  Lofi wireframe slot for Dave&apos;s{" "}
                  <code>RegistrationForm</code> (<code>src/components/registration/</code>).
                </p>
              </div>
              <span className="rounded-xl border border-line-strong bg-canvas px-3 py-1.5 text-sm font-extrabold text-ink">
                {isYcrOpen
                  ? `${formatIdr(PRICE_YCR_INDIVIDUAL_IDR)} / person`
                  : `${formatIdr(PRICE_WEBINAR_IDR)} / person`}
              </span>
            </div>

            {/* Wireframe Mode Toggle / Fields Preview */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-2 rounded-full border border-dashed border-line-strong bg-canvas p-1">
                <div className="flex-1 rounded-full bg-surface py-2 text-center text-xs font-extrabold text-ink shadow-xs">
                  Individual
                </div>
                <div className="flex-1 rounded-full py-2 text-center text-xs font-bold text-ink-muted">
                  Group (5+ get {DISCOUNT_TIER_5 * 100}% off · 10+ get{" "}
                  {DISCOUNT_TIER_10 * 100}% off)
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Full Name *",
                  "Email Address *",
                  "WhatsApp Number (+62 / 08...) *",
                  "NIM / School / Institution (Optional)",
                ].map((label) => (
                  <div key={label} className="space-y-1">
                    <div className="text-xs font-bold text-ink-2">{label}</div>
                    <div className="h-11 rounded-xl border border-dashed border-line-strong bg-canvas/70 px-3 py-2.5 text-xs text-ink-muted">
                      [Input wireframe]
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-ink-2">
                  Payment Method (Paid Event)
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {["QRIS", "BCAVA", "BRIVA", "BNIVA", "MANDIRIVA"].map(
                    (method) => (
                      <div
                        key={method}
                        className="flex min-h-11 items-center justify-center rounded-xl border border-dashed border-line-strong bg-canvas/70 text-xs font-extrabold text-ink-2"
                      >
                        {method}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-dashed border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-ink-2">
                  <span className="font-bold text-ink">Checkout Summary:</span>{" "}
                  Total{" "}
                  {formatIdr(
                    isYcrOpen ? PRICE_YCR_INDIVIDUAL_IDR : PRICE_WEBINAR_IDR,
                  )}
                </div>
                <button
                  type="button"
                  disabled
                  className="min-h-12 cursor-not-allowed rounded-full bg-road/60 px-6 text-sm font-extrabold text-on-road"
                >
                  Continue to Payment (Wireframe)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
