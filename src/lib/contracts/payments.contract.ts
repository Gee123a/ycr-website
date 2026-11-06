export type OrderType = "EVENT_TICKET" | "MARKETPLACE" | "DONATION";

export interface CheckoutSessionResponse {
  orderCode: string;
  orderType: OrderType;
  paymentStatus: "PENDING" | "PAID";
  amountTotalIdr: number;
  paymentMethod: string;
  qrImageUrl?: string;
  vaNumber?: string;
  snapToken?: string;
  expiresAt: string;
  ticketCode?: string;
}
