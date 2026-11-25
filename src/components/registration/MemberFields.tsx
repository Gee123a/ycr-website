import { Field } from "@/components/marketplace/Field";
import { cleanWhatsapp } from "@/components/marketplace/checkout";
import type { Member } from "@/lib/contracts";

export type MemberErrors = Record<string, string>;

export const MEMBER_MESSAGES: Record<keyof Member, string> = {
  fullName: "Enter a full name, 3 to 100 letters.",
  email: "Enter an email like name@email.com.",
  whatsapp: "Enter an Indonesian number like 0812 3456 7890.",
  nimOrInstitution: "Keep this under 100 characters.",
};

export function readMember(data: FormData, rowId: number) {
  const text = (name: keyof Member) => String(data.get(`${name}-${rowId}`) ?? "").trim();
  return {
    fullName: text("fullName"),
    email: text("email"),
    whatsapp: cleanWhatsapp(text("whatsapp")),
    nimOrInstitution: text("nimOrInstitution") || undefined,
  };
}

export function MemberFields({
  rowId,
  errors,
  isVisitor,
  autoFocus,
}: {
  rowId: number;
  errors: MemberErrors;
  isVisitor: boolean;
  autoFocus?: boolean;
}) {
  const field = (name: keyof Member, autoComplete: string) => ({
    name: `${name}-${rowId}`,
    error: errors[`${name}-${rowId}`],
    autoComplete: isVisitor ? autoComplete : "off",
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" placeholder="Maria Santoso" autoFocus={autoFocus} {...field("fullName", "name")} />
      <Field label="Email" type="email" placeholder="name@email.com" {...field("email", "email")} />
      <Field
        label="WhatsApp number"
        type="tel"
        inputMode="tel"
        placeholder="0812 3456 7890"
        {...field("whatsapp", "tel")}
      />
      <Field
        label="NIM or institution (optional)"
        placeholder="0106012410001"
        {...field("nimOrInstitution", "organization")}
      />
    </div>
  );
}
