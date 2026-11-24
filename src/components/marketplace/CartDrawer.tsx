"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { CheckoutSessionResponse, CreateMarketplaceOrderInput, ProductSummary } from "@/lib/contracts";
import { cartTotalIdr, maxQuantity, reconcile, setQuantity, type CartItem } from "./cart";
import { updateCart, useCart, useToast } from "./cart-store";
import { formatRupiah } from "./catalog";
import type { CheckoutResult } from "./checkout";
import { CheckoutForm } from "./CheckoutForm";
import { Sheet } from "./Sheet";

const ICON_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink disabled:opacity-40";

export function CartDrawer({
  products,
  checkout,
}: {
  products: ProductSummary[];
  checkout: (input: CreateMarketplaceOrderInput) => Promise<CheckoutResult>;
}) {
  const cart = reconcile(useCart(), products);
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<CheckoutSessionResponse | null>(null);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div
        role="status"
        className={
          toast
            ? "fixed inset-x-4 bottom-20 z-30 mx-auto w-fit max-w-sm rounded-xl bg-surface-raised px-4 py-3 text-sm font-semibold shadow-raised"
            : "sr-only"
        }
      >
        {toast}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-20 inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-5 font-extrabold text-on-forest shadow-raised"
      >
        <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
        Cart
        <span className="tabular-nums">
          ({count}
          <span className="sr-only"> items</span>)
        </span>
      </button>

      {isOpen && (
        <Sheet
          title="Your cart"
          placement="side"
          onClose={() => {
            setIsOpen(false);
            setSession(null);
          }}
        >
          {session ? (
            <p role="status">
              Order <strong>{session.orderCode}</strong> is reserved. Total {formatRupiah(session.amountTotalIdr)}.
            </p>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <ShoppingBag size={40} strokeWidth={1.75} className="text-forest" aria-hidden="true" />
              <h3 className="text-xl font-extrabold">Your cart is empty</h3>
              <p className="text-sm text-ink-2">Pick something from the marketplace and it will show up here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <ul className="flex flex-col divide-y divide-line">
                {cart.map((item) => (
                  <CartRow key={`${item.productId}-${item.variantLabel}`} cart={cart} item={item} products={products} />
                ))}
              </ul>
              <p className="flex items-baseline justify-between border-t border-line pt-4">
                <span className="font-bold">Subtotal</span>
                <span className="text-xl font-extrabold tabular-nums">{formatRupiah(cartTotalIdr(cart, products))}</span>
              </p>
              <CheckoutForm items={cart} checkout={checkout} onSession={setSession} />
            </div>
          )}
        </Sheet>
      )}
    </>
  );
}

function CartRow({ cart, item, products }: { cart: CartItem[]; item: CartItem; products: ProductSummary[] }) {
  const product = products.find((candidate) => candidate.id === item.productId);
  if (!product) return null;

  const label = item.variantLabel ? `${product.name}, ${item.variantLabel}` : product.name;
  const change = (quantity: number) =>
    updateCart((current) => setQuantity(reconcile(current, products), item, quantity, product.stockAvailable));

  return (
    <li className="flex flex-col gap-2 py-4 first:pt-0">
      <div className="flex justify-between gap-3">
        <p className="font-bold">
          {product.name}
          {item.variantLabel && <span className="block text-sm font-semibold text-ink-2">{item.variantLabel}</span>}
        </p>
        <p className="font-extrabold whitespace-nowrap tabular-nums">{formatRupiah(product.priceIdr * item.quantity)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={ICON_BUTTON}
          aria-label={`One less ${label}`}
          disabled={item.quantity <= 1}
          onClick={() => change(item.quantity - 1)}
        >
          <Minus size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <span className="min-w-8 text-center font-bold tabular-nums" aria-live="polite">
          {item.quantity}
        </span>
        <button
          type="button"
          className={ICON_BUTTON}
          aria-label={`One more ${label}`}
          disabled={item.quantity >= maxQuantity(cart, item, product.stockAvailable)}
          onClick={() => change(item.quantity + 1)}
        >
          <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ml-auto inline-flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface"
          aria-label={`Remove ${label}`}
          onClick={() => change(0)}
        >
          <Trash2 size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
