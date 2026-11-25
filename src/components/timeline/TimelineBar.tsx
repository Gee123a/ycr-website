"use client";

import { useState } from "react";
import { Check, Clock, MapPin, Radio, User } from "lucide-react";
import type {
  RundownSession,
  TimelineMilestone,
} from "@/lib/contracts/timeline.contract";
import {
  MOCK_MILESTONES,
  MOCK_RUNDOWN,
  formatShortDate,
  formatTimeRange,
  isDDay,
} from "./mock-timeline";
import { TimelineModal } from "./TimelineModal";

type ModalSelection =
  | { kind: "milestone"; item: TimelineMilestone }
  | { kind: "session"; item: RundownSession };

interface TimelineBarProps {
  milestones?: TimelineMilestone[];
  rundown?: RundownSession[];
}

export function TimelineBar({
  milestones = MOCK_MILESTONES,
  rundown = MOCK_RUNDOWN,
}: TimelineBarProps) {
  const [selected, setSelected] = useState<ModalSelection | null>(null);
  const [previewDDay, setPreviewDDay] = useState<boolean>(() => isDDay());

  return (
    <>
      <section
        aria-label="Event Journey Timeline"
        className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-[1120px] px-4 py-3 sm:px-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
              [Lofi Wireframe] Journey Progress · Click a node for details
            </span>
            <button
              type="button"
              onClick={() => setPreviewDDay((v) => !v)}
              className="min-h-9 rounded-full border border-dashed border-line-strong bg-canvas px-3 text-xs font-bold text-ink-2 hover:text-ink"
            >
              Preview Mode: {previewDDay ? "D-Day Hero" : "Pre-D-Day Bar"}
            </button>
          </div>

          <ol className="relative grid grid-cols-4 items-start gap-2">
            <div
              aria-hidden="true"
              className="absolute top-5 right-[12%] left-[12%] h-0.5 border-t-2 border-dashed border-line-strong"
            />
            {milestones.map((m) => {
              const isPast = m.state === "PAST";
              const isNow = m.state === "NOW";
              return (
                <li key={m.id} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelected({ kind: "milestone", item: m })}
                    title={`${m.title} (${formatShortDate(m.startsAt)})`}
                    className="group flex min-h-11 min-w-11 flex-col items-center gap-1.5 rounded-xl px-2 py-1 text-center transition-colors hover:bg-canvas"
                  >
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-transform group-hover:scale-105",
                        isPast
                          ? "border-forest bg-forest text-on-forest"
                          : isNow
                            ? "animate-pulse border-wood bg-sun text-ink shadow-[0_0_0_4px_var(--sun-soft)]"
                            : "border-line-strong bg-surface text-ink-muted",
                      ].join(" ")}
                    >
                      {isPast ? <Check className="h-4 w-4" /> : m.title[0]}
                    </span>
                    <span className="text-xs font-extrabold text-ink sm:text-sm">
                      {m.title}
                    </span>
                    <span className="hidden text-[11px] font-semibold text-ink-muted sm:inline">
                      {formatShortDate(m.startsAt)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {previewDDay && (
        <section
          aria-label="D-Day Live Rundown Showcase"
          className="border-b border-line bg-sun-soft/40 py-8"
        >
          <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">
                  <Radio className="h-3.5 w-3.5" />
                  D-Day Hero Stage (Lofi)
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
                  Today&apos;s Live Rundown — The Highway
                </h2>
              </div>
              <span className="rounded-xl border border-dashed border-line-strong bg-surface px-3 py-1.5 text-xs font-bold text-ink-2">
                Auto-expands when Date.now() &gt;= YCR_DATE_MIDNIGHT
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rundown.map((session, idx) => {
                const isLive = idx === 1;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() =>
                      setSelected({ kind: "session", item: session })
                    }
                    className={[
                      "flex min-h-11 flex-col items-start gap-2 rounded-leaf border-2 p-5 text-left transition-all hover:shadow-card",
                      isLive
                        ? "border-wood bg-surface shadow-card"
                        : "border-dashed border-line-strong bg-surface/80",
                    ].join(" ")}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeRange(session.startsAt, session.endsAt)}
                      </span>
                      {isLive && (
                        <span className="rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-extrabold text-ink">
                          HAPPENING NOW
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-ink">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-ink-2">
                      {session.speaker && (
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-ink-muted" />
                          {session.speaker}
                        </span>
                      )}
                      {session.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-ink-muted" />
                          {session.location}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TimelineModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}
