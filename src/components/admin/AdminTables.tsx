"use client";

import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { formatRupiah } from "@/components/marketplace/catalog";
import type { AdminOrder, AdminParticipant, PaymentStatus } from "@/lib/contracts";
import { filterOrders, filterParticipants, toCsv, type StatusFilter } from "./report";

const CONTROL = "min-h-11 rounded-xl border border-line-strong bg-surface px-3 text-base";
const STATUS: Record<PaymentStatus, { label: string; classes: string }> = {
  PAID: { label: "Paid", classes: "bg-leaf-soft text-forest-ink" },
  PENDING: { label: "Pending", classes: "bg-sun-soft text-ink" },
  EXPIRED: { label: "Expired", classes: "border border-line bg-surface text-ink-2" },
  FAILED: { label: "Failed", classes: "bg-berry-soft text-berry-ink" },
};
const ORDER_TYPE_LABELS: Record<AdminOrder["orderType"], string> = {
  EVENT_TICKET: "Ticket",
  MARKETPLACE: "Marketplace",
  DONATION: "Donation",
};

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});
const formatWib = (iso: string) => `${dateTime.format(new Date(iso))} WIB`;

function downloadCsv(fileName: string, csv: string) {
  // The byte order mark makes Excel read the file as UTF-8.
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminTables({ participants, orders }: { participants: AdminParticipant[]; orders: AdminOrder[] }) {
  const [view, setView] = useState<"participants" | "orders">("participants");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const shownParticipants = filterParticipants(participants, query, status);
  const shownOrders = filterOrders(orders, query, status);
  const shownCount = view === "participants" ? shownParticipants.length : shownOrders.length;

  function exportCsv() {
    if (view === "participants") {
      downloadCsv(
        "ycr-participants.csv",
        toCsv(
          ["Name", "NIM or institution", "Email", "WhatsApp", "Event", "Tier", "Payment", "Ticket code", "Checked in at"],
          shownParticipants.map((row) => [
            row.fullName,
            row.nimOrInstitution,
            row.email,
            row.whatsapp,
            row.eventSlug,
            row.tierName,
            row.paymentStatus,
            row.ticketCode,
            row.checkedInAt,
          ]),
        ),
      );
      return;
    }
    downloadCsv(
      "ycr-orders.csv",
      toCsv(
        ["Order code", "Type", "Buyer", "Total (Rp)", "Payment", "Method", "Merch items", "Campaign", "Created at"],
        shownOrders.map((row) => [
          row.orderCode,
          row.orderType,
          row.buyerName,
          row.amountTotalIdr,
          row.paymentStatus,
          row.paymentMethod,
          row.merchQuantity,
          row.donationCampaign,
          row.createdAt,
        ]),
      ),
    );
  }

  return (
    <section aria-label="Records" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div role="group" aria-label="Choose a table" className="flex gap-2">
          {(["participants", "orders"] as const).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={view === name}
              onClick={() => setView(name)}
              className="min-h-11 rounded-xl border border-line-strong px-4 text-sm font-bold text-ink-2 aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-on-forest"
            >
              {name === "participants" ? "Participants" : "Orders"}
            </button>
          ))}
        </div>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm font-bold">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={view === "participants" ? "Maria or YCR-T-0001" : "Maria or YCR-2026-A001"}
            className={`${CONTROL} font-normal`}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Payment
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className={`${CONTROL} font-normal`}
          >
            <option value="ALL">All</option>
            {Object.entries(STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border-[1.5px] border-forest px-4 text-sm font-extrabold text-forest-ink hover:bg-leaf-soft"
        >
          <Download size={20} strokeWidth={1.75} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <p role="status" className="text-sm text-ink-2">
        {shownCount === 1 ? "1 row" : `${shownCount} rows`}
      </p>

      {view === "participants" ? (
        <Table caption="Participants" header={["Name", "Event and tier", "Payment", "Ticket", "Check-in", "WhatsApp"]}>
          {shownParticipants.map((row) => (
            <tr key={row.registrationId} className="border-t border-line">
              <td className="p-3 font-bold">
                {row.fullName}
                <span className="block text-xs font-normal text-ink-2">{row.nimOrInstitution}</span>
              </td>
              <td className="p-3">
                {row.eventSlug.toUpperCase()} {row.tierName}
              </td>
              <td className="p-3">
                <StatusBadge status={row.paymentStatus} />
              </td>
              <td className="p-3 tabular-nums">{row.ticketCode ?? "None"}</td>
              <td className="p-3 tabular-nums">{row.checkedInAt ? formatWib(row.checkedInAt) : "Not yet"}</td>
              <td className="p-3 tabular-nums">{row.whatsapp}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <Table caption="Orders" header={["Order", "Type", "Buyer", "Total", "Payment", "Created"]}>
          {shownOrders.map((row) => (
            <tr key={row.orderCode} className="border-t border-line">
              <td className="p-3 font-bold tabular-nums">{row.orderCode}</td>
              <td className="p-3">
                {ORDER_TYPE_LABELS[row.orderType]}
                {row.donationCampaign && ` (${row.donationCampaign.toUpperCase()})`}
              </td>
              <td className="p-3">{row.buyerName}</td>
              <td className="p-3 text-right tabular-nums">{formatRupiah(row.amountTotalIdr)}</td>
              <td className="p-3">
                <StatusBadge status={row.paymentStatus} />
              </td>
              <td className="p-3 tabular-nums">{formatWib(row.createdAt)}</td>
            </tr>
          ))}
        </Table>
      )}
      {shownCount === 0 && <p className="py-6 text-center text-sm text-ink-2">Nothing matches. Clear the search or payment filter.</p>}
    </section>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const { label, classes } = STATUS[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}>{label}</span>;
}

function Table({ caption, header, children }: { caption: string; header: string[]; children: ReactNode }) {
  return (
    <div tabIndex={0} role="region" aria-label={caption} className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-ink-2">
          <tr>
            {header.map((label) => (
              <th key={label} scope="col" className="p-3 font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
