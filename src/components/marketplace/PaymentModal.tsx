"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Image from "next/image";
import { Clock, Copy, Download, Flower2 } from "lucide-react";
import type { CheckoutSessionResponse, PaidMethod } from "@/lib/contracts";
import { formatRupiah } from "./catalog";
import { PAYMENT_METHOD_LABELS } from "./checkout";
import { formatCountdown, secondsLeft } from "./countdown";
import { previewOrderStatus, watchOrderStatus, type OrderStatus } from "./order-status";
import { Sheet } from "./Sheet";

const PRIMARY =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-road px-6 font-extrabold text-on-road hover:bg-road-hover";
const SECONDARY =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-forest px-5 font-extrabold text-forest-ink hover:bg-leaf-soft";
const GHOST = "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold text-ink-2 hover:bg-surface";

export function PaymentModal({
  session,
  onClose,
  onRetry,
  onPaid,
  paidMessage = "Thank you! We'll see you on The Highway.",
}: {
  session: CheckoutSessionResponse;
  onClose: (isFinished: boolean) => void;
  onRetry: () => void;
  onPaid?: () => void;
  paidMessage?: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(session.paymentStatus);
  const [now, setNow] = useState(() => Date.now());

  const left = secondsLeft(session.expiresAt, now);
  const isPaid = status === "PAID";
  const isOver = !isPaid && (status !== "PENDING" || left === 0);

  const handleStatus = useEffectEvent((next: OrderStatus) => {
    if (isPaid) return;
    setStatus(next);
    if (next === "PAID") onPaid?.();
  });
  // Keeps listening after the countdown ends: a payment made in the last second still arrives.
  useEffect(() => watchOrderStatus(session.orderCode, (next) => handleStatus(next)), [session.orderCode]);

  const isCounting = !isPaid && !isOver;
  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isCounting]);

  return (
    <Sheet
      title={isPaid ? "Payment received" : isOver ? "Payment not completed" : "Pay for your order"}
      placement="center"
      onClose={() => onClose(isPaid || isOver)}
    >
      <div className="flex flex-col gap-5">
        <p role="status" className="sr-only">
          {isPaid ? "Payment received" : isOver ? "This payment has expired" : "Waiting for payment"}
        </p>

        {isPaid && (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex size-20 items-center justify-center rounded-full bg-lotus text-wood" aria-hidden="true">
              <Flower2 size={40} strokeWidth={1.75} />
            </span>
            <p>{paidMessage}</p>
            <p className="text-sm text-ink-2">
              Order code <strong className="text-ink">{session.orderCode}</strong>
            </p>
            {session.ticketCode && (
              <p className="text-sm text-ink-2">
                Ticket code <strong className="text-ink">{session.ticketCode}</strong>
              </p>
            )}
          </div>
        )}

        {isOver && (
          <div className="flex flex-col items-center gap-3 text-center">
            <Clock size={40} strokeWidth={1.75} className="text-ink-2" aria-hidden="true" />
            <p className="text-ink-2">
              The time to pay for order <strong className="text-ink">{session.orderCode}</strong> ran out or the payment
              didn&apos;t go through. If money left your account, contact the committee with this code.
            </p>
            <button type="button" className={PRIMARY} onClick={onRetry}>
              Try again
            </button>
          </div>
        )}

        {!isPaid && !isOver && (
          <>
            <div className="flex items-end justify-between gap-3">
              <p>
                <span className="block text-sm text-ink-2">Total</span>
                <span className="text-[26px] leading-8 font-extrabold tabular-nums">{formatRupiah(session.amountTotalIdr)}</span>
              </p>
              <p className="text-right">
                <span className="block text-sm text-ink-2">Pay within</span>
                <span role="timer" className={`text-xl font-extrabold tabular-nums ${left <= 60 ? "text-berry" : ""}`}>
                  {formatCountdown(left)}
                </span>
              </p>
            </div>
            <PaymentInstructions session={session} />
            <p className="text-center text-sm text-ink-2">
              Waiting for payment… This page updates by itself. Order code{" "}
              <strong className="text-ink">{session.orderCode}</strong>
            </p>
            <button type="button" className={GHOST} onClick={onRetry}>
              Go back and change something
            </button>
            {process.env.NODE_ENV === "development" && (
              <div className="flex justify-center gap-2 border-t border-line pt-3">
                <button type="button" className={GHOST} onClick={() => previewOrderStatus(session.orderCode, "PAID")}>
                  Preview: paid
                </button>
                <button type="button" className={GHOST} onClick={() => previewOrderStatus(session.orderCode, "EXPIRED")}>
                  Preview: expired
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}

function PaymentInstructions({ session }: { session: CheckoutSessionResponse }) {
  if (session.qrImageUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl bg-white p-3">
          <Image src={session.qrImageUrl} alt="QRIS code for this order" width={240} height={240} unoptimized />
        </div>
        <p className="text-center text-sm text-ink-2">
          Scan this with any bank or e-wallet app. On this phone, save the image and upload it in your app.
        </p>
        <a
          href={session.qrImageUrl}
          download={`${session.orderCode}-qris`}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY}
        >
          <Download size={20} strokeWidth={1.75} aria-hidden="true" />
          Save QR image
        </a>
      </div>
    );
  }

  if (session.vaNumber) return <VirtualAccount vaNumber={session.vaNumber} paymentMethod={session.paymentMethod} />;

  return (
    <p role="alert" className="rounded-xl bg-berry-soft px-4 py-3 text-sm text-berry-ink">
      We couldn&apos;t load the payment details. Go back and try again.
    </p>
  );
}

function VirtualAccount({ vaNumber, paymentMethod }: { vaNumber: string; paymentMethod: string }) {
  const [copyMessage, setCopyMessage] = useState("");
  const bank = PAYMENT_METHOD_LABELS[paymentMethod as PaidMethod] ?? paymentMethod;

  async function copy() {
    try {
      await navigator.clipboard.writeText(vaNumber);
      setCopyMessage("Number copied");
    } catch {
      setCopyMessage("Couldn't copy. Press and hold the number instead.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-4 text-center">
        <p className="font-bold">{bank}</p>
        <p className="text-xl font-extrabold break-all tabular-nums select-all">{vaNumber}</p>
        <button type="button" className={SECONDARY} onClick={copy}>
          <Copy size={20} strokeWidth={1.75} aria-hidden="true" />
          Copy number
        </button>
        <p role="status" className="min-h-5 text-sm text-ink-2">
          {copyMessage}
        </p>
      </div>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-2">
        <li>Open your bank app or go to an ATM.</li>
        <li>Choose Virtual Account and enter the number above.</li>
        <li>Check the amount, then confirm the payment.</li>
      </ol>
    </div>
  );
}
