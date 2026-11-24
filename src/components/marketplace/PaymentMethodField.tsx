import { PaidMethodSchema } from "@/lib/contracts";
import { PAYMENT_METHOD_LABELS } from "./checkout";
import { CONTROL_CLASSES } from "./Field";

export function PaymentMethodField() {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="paymentMethod" className="text-sm font-bold">
        Payment method
      </label>
      <select id="paymentMethod" name="paymentMethod" className={`${CONTROL_CLASSES} border-line-strong`}>
        {PaidMethodSchema.options.map((method) => (
          <option key={method} value={method}>
            {PAYMENT_METHOD_LABELS[method]}
          </option>
        ))}
      </select>
    </div>
  );
}
