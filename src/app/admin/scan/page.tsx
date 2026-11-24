import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { GateScanner } from "@/components/admin/GateScanner";
import { checkInTicket } from "./mock-check-in";

export const metadata: Metadata = {
  title: "Gate scanner",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          aria-label="Back to the dashboard"
          className="inline-flex size-11 items-center justify-center rounded-xl text-ink-2 hover:bg-surface"
        >
          <ArrowLeft size={24} strokeWidth={1.75} aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-extrabold">Gate scanner</h1>
      </div>

      <p className="flex items-start gap-2 rounded-xl bg-sun-soft px-4 py-3 text-sm text-ink">
        <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
        Preview: only sample tickets such as YCR-T-0002 work.
      </p>

      <GateScanner checkIn={checkInTicket} />
    </main>
  );
}
