import type { AdminDashboardResponse } from "@/lib/contracts";

// Invented people and orders, so the dashboard can be built before Sean's admin service exists (DV07 swaps this out).
export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return {
    participants: [
      { registrationId: "r1", fullName: "Maria Santoso", nimOrInstitution: "0106012410001", email: "maria@example.com", whatsapp: "081200000001", eventSlug: "ycr", tierName: "Early Bird", paymentStatus: "PAID", ticketCode: "YCR-T-0001", checkedInAt: "2026-11-24T02:05:00Z" },
      { registrationId: "r2", fullName: "Andreas Wijaya", nimOrInstitution: "0106012410002", email: "andreas@example.com", whatsapp: "081200000002", eventSlug: "ycr", tierName: "Regular", paymentStatus: "PAID", ticketCode: "YCR-T-0002", checkedInAt: null },
      { registrationId: "r3", fullName: "Clara Tanuwijaya", nimOrInstitution: "Paroki Santa Maria", email: "clara@example.com", whatsapp: "081200000003", eventSlug: "ycr", tierName: "VIP", paymentStatus: "PENDING", ticketCode: null, checkedInAt: null },
      { registrationId: "r4", fullName: "Yohanes Pratama", nimOrInstitution: "0106012410004", email: "yohanes@example.com", whatsapp: "081200000004", eventSlug: "heart", tierName: "Regular", paymentStatus: "PAID", ticketCode: "HEART-T-0001", checkedInAt: null },
      { registrationId: "r5", fullName: "Theresia Lim", nimOrInstitution: "0106012410005", email: "theresia@example.com", whatsapp: "081200000005", eventSlug: "ziarah", tierName: "Regular", paymentStatus: "EXPIRED", ticketCode: null, checkedInAt: null },
    ],
    orders: [
      { orderCode: "YCR-2026-A001", orderType: "EVENT_TICKET", buyerName: "Maria Santoso", amountTotalIdr: 75000, paymentStatus: "PAID", paymentMethod: "QRIS", merchQuantity: 0, donationCampaign: null, createdAt: "2026-11-20T03:00:00Z" },
      { orderCode: "YCR-2026-A002", orderType: "MARKETPLACE", buyerName: "Andreas Wijaya", amountTotalIdr: 255000, paymentStatus: "PAID", paymentMethod: "BCAVA", merchQuantity: 3, donationCampaign: null, createdAt: "2026-11-21T06:30:00Z" },
      { orderCode: "YCR-2026-A003", orderType: "DONATION", buyerName: "Agnes Halim", amountTotalIdr: 100000, paymentStatus: "PAID", paymentMethod: "QRIS", merchQuantity: 0, donationCampaign: "ycr", createdAt: "2026-11-22T09:15:00Z" },
      { orderCode: "YCR-2026-A004", orderType: "DONATION", buyerName: "Paulus Hartono", amountTotalIdr: 50000, paymentStatus: "PAID", paymentMethod: "MANDIRIVA", merchQuantity: 0, donationCampaign: "baksos", createdAt: "2026-11-22T11:40:00Z" },
      { orderCode: "YCR-2026-A005", orderType: "EVENT_TICKET", buyerName: "Clara Tanuwijaya", amountTotalIdr: 150000, paymentStatus: "PENDING", paymentMethod: "BRIVA", merchQuantity: 0, donationCampaign: null, createdAt: "2026-11-24T04:20:00Z" },
      { orderCode: "YCR-2026-A006", orderType: "MARKETPLACE", buyerName: "Theresia Lim", amountTotalIdr: 95000, paymentStatus: "EXPIRED", paymentMethod: "QRIS", merchQuantity: 1, donationCampaign: null, createdAt: "2026-11-23T01:10:00Z" },
    ],
  };
}
