import type { EventSlug } from "./common.contract";
import type { DonationCampaign } from "./donations.contract";
import type { OrderType } from "./payments.contract";

export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

// Dashboard read models (Sean BE -> Dave FE)
export interface AdminParticipant {
  registrationId: string;
  fullName: string;
  nimOrInstitution: string;
  email: string;
  whatsapp: string;
  eventSlug: EventSlug;
  tierName: string;
  paymentStatus: PaymentStatus;
  ticketCode: string | null;
  checkedInAt: string | null;
}

export interface AdminOrder {
  orderCode: string;
  orderType: OrderType;
  buyerName: string;
  amountTotalIdr: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  merchQuantity: number;
  donationCampaign: DonationCampaign | null;
  createdAt: string;
}

export interface AdminDashboardResponse {
  participants: AdminParticipant[];
  orders: AdminOrder[];
}
