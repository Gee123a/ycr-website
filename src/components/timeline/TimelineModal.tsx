"use client";

import { useEffect } from "react";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";
import type {
  RundownSession,
  TimelineMilestone,
} from "@/lib/contracts/timeline.contract";
import { formatShortDate, formatTimeRange } from "./mock-timeline";

type ModalItem =
  | { kind: "milestone"; item: TimelineMilestone }
  | { kind: "session"; item: RundownSession };

interface TimelineModalProps {
  selected: ModalItem | null;
  onClose: () => void;
}

export function TimelineModal({ selected, onClose }: TimelineModalProps) {
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, onClose]);

  if (!selected) return null;

  const isMilestone = selected.kind === "milestone";
  const title = selected.item.title;
  const startsAt = selected.item.startsAt;
  const endsAt = selected.item.endsAt;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-leaf border-2 border-dashed border-line-strong bg-surface-raised p-6 shadow-raised"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block rounded-full border border-line-strong bg-canvas px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-ink-2">
              {isMilestone ? `Milestone · ${selected.item.state}` : "D-Day Session"}
            </span>
            <h2
              id="timeline-modal-title"
              className="text-xl font-extrabold text-ink"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-canvas"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 border-t border-dashed border-line pt-4 text-sm text-ink-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-ink-muted" />
            <span>{formatShortDate(startsAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-ink-muted" />
            <span>{formatTimeRange(startsAt, endsAt)}</span>
          </div>
          {!isMilestone && selected.item.speaker && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-ink-muted" />
              <span>{selected.item.speaker}</span>
            </div>
          )}
          {!isMilestone && selected.item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-ink-muted" />
              <span>{selected.item.location}</span>
            </div>
          )}
        </div>

        {isMilestone && selected.item.description && (
          <p className="mt-4 rounded-xl border border-dashed border-line bg-canvas p-3 text-sm leading-relaxed text-ink-2">
            {selected.item.description}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full border border-line-strong bg-surface px-5 text-sm font-bold text-ink hover:bg-canvas"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
