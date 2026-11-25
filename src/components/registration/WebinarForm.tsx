"use client";

import { useRef, type FormEvent } from "react";
import { formatRupiah } from "@/components/marketplace/catalog";
import { PaymentMethodField } from "@/components/marketplace/PaymentMethodField";
import { registerWebinar } from "@/app/mock-registration";
import { PRICE_WEBINAR_IDR } from "@/lib/constants";
import { CreateWebinarRegistrationSchema } from "@/lib/contracts";
import { MemberFields, readMember } from "./MemberFields";
import { RegistrationActions } from "./RegistrationActions";
import { useRegistration } from "./useRegistration";

const ROW_ID = 0;

export function WebinarForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const registration = useRegistration();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    registration.submit(
      event.currentTarget,
      [ROW_ID],
      CreateWebinarRegistrationSchema,
      { member: readMember(data, ROW_ID), paymentMethod: data.get("paymentMethod") },
      registerWebinar,
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-5">
      <p>
        <span className="inline-flex rounded-full bg-sun-soft px-3 py-1 font-extrabold text-ink tabular-nums">
          {formatRupiah(PRICE_WEBINAR_IDR)}
        </span>
      </p>
      <MemberFields rowId={ROW_ID} errors={registration.errors} isVisitor />
      <PaymentMethodField />
      <RegistrationActions registration={registration} onPaid={() => formRef.current?.reset()} />
    </form>
  );
}
