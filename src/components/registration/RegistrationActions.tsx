"use client";

import { PaymentModal } from "@/components/marketplace/PaymentModal";
import type { useRegistration } from "./useRegistration";

export function RegistrationActions({
  registration,
  onPaid,
}: {
  registration: ReturnType<typeof useRegistration>;
  onPaid: () => void;
}) {
  const { failure, isPending, session, setSession, isPaying, setIsPaying } = registration;

  return (
    <>
      {failure && (
        <p role="alert" className="rounded-xl bg-berry-soft px-4 py-3 text-sm text-berry-ink">
          {failure}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-road px-6 font-extrabold text-on-road hover:bg-road-hover disabled:opacity-70"
      >
        {isPending ? "Preparing your payment…" : "Register and pay"}
      </button>
      {session && !isPaying && (
        <button
          type="button"
          onClick={() => setIsPaying(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-forest px-5 font-extrabold text-forest-ink hover:bg-leaf-soft"
        >
          Continue paying for {session.orderCode}
        </button>
      )}
      {session && isPaying && (
        <PaymentModal
          session={session}
          onClose={(isFinished) => {
            setIsPaying(false);
            if (isFinished) setSession(null);
          }}
          onRetry={() => {
            setIsPaying(false);
            setSession(null);
          }}
          onPaid={onPaid}
          paidMessage="You're registered! Keep your order code. See you on The Highway."
        />
      )}
    </>
  );
}
