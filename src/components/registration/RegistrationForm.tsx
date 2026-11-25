"use client";

import { useSyncExternalStore } from "react";
import { registrationMode } from "./pricing";
import { WebinarForm } from "./WebinarForm";
import { YcrForm } from "./YcrForm";

const neverChanges = () => () => {};

export function RegistrationForm() {
  // The page is prerendered, so only the visitor's browser knows today's date.
  const mode = useSyncExternalStore(
    neverChanges,
    () => registrationMode(Date.now()),
    () => null,
  );

  return (
    <section id="register" aria-labelledby="register-title" className="mx-auto w-full max-w-[640px]">
      <div className="flex flex-col gap-5 rounded-leaf bg-surface p-5 shadow-card sm:p-6">
        <h2 id="register-title" className="font-display text-[26px] leading-[30px] text-forest-ink">
          {mode === "webinar" ? "Join the webinar" : "Register for The Highway"}
        </h2>
        {mode === null && (
          <div aria-busy="true" aria-label="Loading the registration form" className="h-96 animate-pulse rounded-xl bg-line" />
        )}
        {mode === "webinar" && <WebinarForm />}
        {mode === "ycr" && <YcrForm />}
      </div>
    </section>
  );
}
