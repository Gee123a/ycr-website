import { formatRupiah } from "@/components/marketplace/catalog";
import type { DashboardTotals } from "./report";

const CARD = "rounded-xl border border-line bg-surface p-4";

export function KpiCards({ totals }: { totals: DashboardTotals }) {
  const kpis: [label: string, value: string, note?: string][] = [
    ["Total revenue", formatRupiah(totals.revenueIdr), "Paid orders only"],
    ["Registrations", String(totals.registrations), `${totals.paidRegistrations} paid`],
    ["Merch sold", String(totals.merchSold), "Items in paid orders"],
    ["Checked in", String(totals.checkedIn), `of ${totals.paidRegistrations} paid`],
  ];

  return (
    <section aria-label="Totals" className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(([label, value, note]) => (
          <div key={label} className={CARD}>
            <dt className="text-sm text-ink-2">{label}</dt>
            <dd className="text-xl font-extrabold break-words tabular-nums sm:text-2xl">{value}</dd>
            <dd className="text-xs text-ink-muted">{note}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-3 sm:grid-cols-2">
        <Breakdown title="Tickets sold by tier" rows={totals.ticketsByTier.map(([label, count]) => [label, String(count)])} />
        <Breakdown
          title="Donations by campaign"
          rows={totals.donationsByCampaign.map(([label, amount]) => [label, formatRupiah(amount)])}
        />
      </div>
    </section>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [label: string, value: string][] }) {
  return (
    <div className={CARD}>
      <h2 className="pb-2 text-[17px] font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-2">None yet.</p>
      ) : (
        <dl className="divide-y divide-line text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 py-1.5">
              <dt className="text-ink-2">{label}</dt>
              <dd className="font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
