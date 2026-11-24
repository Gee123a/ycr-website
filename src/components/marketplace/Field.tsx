import type { InputHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";

export const CONTROL_CLASSES =
  "min-h-12 w-full rounded-xl border bg-surface px-3 text-base text-ink placeholder:text-ink-muted";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm text-berry">
      <CircleAlert size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function Field({
  label,
  name,
  error,
  ...input
}: { label: string; name: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${name}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${CONTROL_CLASSES} ${error ? "border-berry" : "border-line-strong"}`}
        {...input}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
