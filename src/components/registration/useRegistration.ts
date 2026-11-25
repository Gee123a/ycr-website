"use client";

import { useState, useTransition } from "react";
import type { z } from "zod";
import { focusFirstError, type CheckoutResult } from "@/components/marketplace/checkout";
import type { CheckoutSessionResponse, Member } from "@/lib/contracts";
import { MEMBER_MESSAGES, type MemberErrors } from "./MemberFields";

export function useRegistration() {
  const [errors, setErrors] = useState<MemberErrors>({});
  const [failure, setFailure] = useState("");
  const [session, setSession] = useState<CheckoutSessionResponse | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit<Input>(
    form: HTMLFormElement,
    rowIds: number[],
    schema: z.ZodType<Input>,
    input: unknown,
    register: (input: Input) => Promise<CheckoutResult>,
  ) {
    const parsed = schema.safeParse(input);
    setFailure("");
    if (!parsed.success) {
      // Paths look like ["member", "email"] or ["members", 2, "email"].
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map(({ path }) => {
            const field = path.at(-1) as keyof Member;
            const row = typeof path[1] === "number" ? path[1] : 0;
            return [`${field}-${rowIds[row]}`, MEMBER_MESSAGES[field]];
          }),
        ),
      );
      focusFirstError(form);
      return;
    }
    setErrors({});
    startTransition(async () => {
      try {
        const result = await register(parsed.data);
        if (result.ok) {
          setSession(result.session);
          setIsPaying(true);
        } else {
          setFailure(result.message);
        }
      } catch {
        setFailure("We couldn't reach the server. Check your connection and try again.");
      }
    });
  }

  return { errors, failure, isPending, session, setSession, isPaying, setIsPaying, submit };
}
