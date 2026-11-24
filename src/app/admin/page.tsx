import type { Metadata } from "next";
import Link from "next/link";
import { Info, ScanLine } from "lucide-react";
import { AdminTables } from "@/components/admin/AdminTables";
import { KpiCards } from "@/components/admin/KpiCards";
import { dashboardTotals } from "@/components/admin/report";
import { getAdminDashboard } from "./mock-dashboard";

export const metadata: Metadata = {
  title: "Committee dashboard",
  robots: { index: false, follow: false },
};

// Sean's middleware (SN01) must protect /admin before DV07 puts real people here.
export default async function AdminPage() {
  const dashboard = await getAdminDashboard();

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold">Committee dashboard</h1>
        <Link
          href="/admin/scan"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-road px-4 text-sm font-extrabold text-on-road hover:bg-road-hover"
        >
          <ScanLine size={20} strokeWidth={1.75} aria-hidden="true" />
          Scan tickets
        </Link>
      </div>

      <p className="flex items-start gap-2 rounded-xl bg-sun-soft px-4 py-3 text-sm text-ink">
        <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
        Preview: these are invented people and orders.
      </p>

      <KpiCards totals={dashboardTotals(dashboard)} />
      <AdminTables participants={dashboard.participants} orders={dashboard.orders} />
    </main>
  );
}
