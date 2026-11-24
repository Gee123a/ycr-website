export type OrderStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

const EVENT_NAME = "ycr-preview-order-status";

// shortcut: there is no Supabase client yet, so only the development preview buttons report a status.
// DV07 replaces this body with a Realtime subscription on orders.payment_status.
export function watchOrderStatus(orderCode: string, onStatus: (status: OrderStatus) => void): () => void {
  function listen(event: Event) {
    const { detail } = event as CustomEvent<{ orderCode: string; status: OrderStatus }>;
    if (detail.orderCode === orderCode) onStatus(detail.status);
  }
  window.addEventListener(EVENT_NAME, listen);
  return () => window.removeEventListener(EVENT_NAME, listen);
}

export function previewOrderStatus(orderCode: string, status: OrderStatus) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { orderCode, status } }));
}
