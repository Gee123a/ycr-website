"use client";

import { useRef, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { PaymentMethodField } from "@/components/marketplace/PaymentMethodField";
import { registerYcr, registerYcrGroup } from "@/app/mock-registration";
import { CreateYcrGroupSchema, CreateYcrRegistrationSchema } from "@/lib/contracts";
import { MemberFields, readMember } from "./MemberFields";
import { PriceSummary } from "./PriceSummary";
import { RegistrationActions } from "./RegistrationActions";
import { useRegistration } from "./useRegistration";

const LEADER_ID = 0;
const TYPES = [
  { isGroup: false, label: "Individual" },
  { isGroup: true, label: "Group" },
];

export function YcrForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const nextRowId = useRef(LEADER_ID + 1);
  const [isGroup, setIsGroup] = useState(false);
  const [extraRowIds, setExtraRowIds] = useState<number[]>([]);
  const registration = useRegistration();

  const rowIds = isGroup ? [LEADER_ID, ...extraRowIds] : [LEADER_ID];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const paymentMethod = data.get("paymentMethod");
    if (isGroup) {
      const members = rowIds.map((rowId) => readMember(data, rowId));
      registration.submit(form, rowIds, CreateYcrGroupSchema, { members, paymentMethod }, registerYcrGroup);
    } else {
      const member = readMember(data, LEADER_ID);
      registration.submit(form, rowIds, CreateYcrRegistrationSchema, { member, paymentMethod }, registerYcr);
    }
  }

  function addMember() {
    const rowId = nextRowId.current++;
    setExtraRowIds((ids) => [...ids, rowId]);
  }

  function removeMember(rowId: number) {
    setExtraRowIds((ids) => ids.filter((id) => id !== rowId));
    addButtonRef.current?.focus();
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-5">
      <fieldset>
        <legend className="pb-2 text-[17px] font-bold">Who are you registering?</legend>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((type) => (
            <label
              key={type.label}
              className="relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-line-strong bg-surface px-4 font-bold text-ink-2 has-checked:border-forest has-checked:bg-forest has-checked:text-on-forest has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
            >
              <input
                type="radio"
                name="registrationType"
                checked={isGroup === type.isGroup}
                onChange={() => setIsGroup(type.isGroup)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="pb-2 text-[17px] font-bold">{isGroup ? "Member 1 (leader)" : "Your details"}</legend>
        <MemberFields rowId={LEADER_ID} errors={registration.errors} isVisitor />
      </fieldset>

      {/* Hidden rather than removed, so switching to Individual and back keeps what was typed. */}
      <div hidden={!isGroup}>
        <div className="flex flex-col gap-5">
          {extraRowIds.map((rowId, index) => (
            <fieldset key={rowId} className="relative border-t border-line pt-4">
              <legend className="sr-only">Member {index + 2}</legend>
              <div className="flex items-center justify-between pb-2">
                <p aria-hidden="true" className="text-[17px] font-bold">
                  Member {index + 2}
                </p>
                <button
                  type="button"
                  aria-label={`Remove member ${index + 2}`}
                  onClick={() => removeMember(rowId)}
                  className="inline-flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface"
                >
                  <X size={24} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
              <MemberFields rowId={rowId} errors={registration.errors} isVisitor={false} autoFocus />
            </fieldset>
          ))}
          <button
            ref={addButtonRef}
            type="button"
            onClick={addMember}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-forest px-5 font-extrabold text-forest-ink hover:bg-leaf-soft"
          >
            <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
            Add member
          </button>
        </div>
      </div>

      <PaymentMethodField />
      <PriceSummary people={rowIds.length} />
      <RegistrationActions
        registration={registration}
        onPaid={() => {
          formRef.current?.reset();
          setIsGroup(false);
          setExtraRowIds([]);
        }}
      />
    </form>
  );
}
