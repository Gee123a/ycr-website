import type { AdminDashboardResponse, AdminOrder, AdminParticipant, PaymentStatus } from "@/lib/contracts";

export interface DashboardTotals {
  revenueIdr: number;
  merchSold: number;
  registrations: number;
  paidRegistrations: number;
  checkedIn: number;
  ticketsByTier: [label: string, count: number][];
  donationsByCampaign: [label: string, amountIdr: number][];
}

function addTo(totals: Map<string, number>, key: string, amount: number) {
  totals.set(key, (totals.get(key) ?? 0) + amount);
}

// Only PAID rows count as money, tickets sold or merch sold.
export function dashboardTotals({ participants, orders }: AdminDashboardResponse): DashboardTotals {
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const paidParticipants = participants.filter((participant) => participant.paymentStatus === "PAID");

  const tiers = new Map<string, number>();
  for (const participant of paidParticipants) {
    addTo(tiers, `${participant.eventSlug.toUpperCase()} ${participant.tierName}`, 1);
  }
  const campaigns = new Map<string, number>();
  for (const order of paidOrders) {
    if (order.donationCampaign) addTo(campaigns, order.donationCampaign.toUpperCase(), order.amountTotalIdr);
  }

  return {
    revenueIdr: paidOrders.reduce((sum, order) => sum + order.amountTotalIdr, 0),
    merchSold: paidOrders.reduce((sum, order) => sum + order.merchQuantity, 0),
    registrations: participants.length,
    paidRegistrations: paidParticipants.length,
    checkedIn: participants.filter((participant) => participant.checkedInAt).length,
    ticketsByTier: [...tiers],
    donationsByCampaign: [...campaigns],
  };
}

export type StatusFilter = PaymentStatus | "ALL";

function matches(query: string, status: StatusFilter, rowStatus: PaymentStatus, ...fields: (string | null)[]): boolean {
  const needle = query.trim().toLowerCase();
  return (status === "ALL" || status === rowStatus) && fields.some((field) => field?.toLowerCase().includes(needle));
}

export function filterParticipants(rows: AdminParticipant[], query: string, status: StatusFilter): AdminParticipant[] {
  return rows.filter((row) => matches(query, status, row.paymentStatus, row.fullName, row.ticketCode));
}

export function filterOrders(rows: AdminOrder[], query: string, status: StatusFilter): AdminOrder[] {
  return rows.filter((row) => matches(query, status, row.paymentStatus, row.buyerName, row.orderCode));
}

type Cell = string | number | null;

function csvCell(value: Cell): string {
  let text = String(value ?? "");
  // Names come from a public form: a leading = + - @ would run as a formula in Excel.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(header: string[], rows: Cell[][]): string {
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
