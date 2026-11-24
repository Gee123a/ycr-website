"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const PLACEMENT = {
  side: "ml-auto h-dvh max-h-none w-full max-w-md sm:rounded-l-3xl",
  center: "mx-auto mt-auto max-h-[92dvh] w-full max-w-md rounded-t-3xl sm:mb-auto sm:rounded-3xl",
};

export function Sheet({
  title,
  placement,
  onClose,
  children,
}: {
  title: string;
  placement: keyof typeof PLACEMENT;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className={`overflow-y-auto overscroll-contain bg-surface-raised p-0 text-ink shadow-raised backdrop:bg-black/50 ${PLACEMENT[placement]}`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-surface-raised py-2 pr-2 pl-5">
        <h2 id={titleId} className="text-xl font-extrabold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={() => ref.current?.close()}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface"
        >
          <X size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
