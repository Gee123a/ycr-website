import { YCR_DATE_MIDNIGHT } from "@/lib/constants";
import type {
  RundownSession,
  TimelineMilestone,
} from "@/lib/contracts/timeline.contract";

export const MOCK_MILESTONES: TimelineMilestone[] = [
  {
    id: "baksos",
    title: "Baksos",
    description:
      "Social outreach & community service to kick off the Highway journey together.",
    startsAt: "2026-11-14T08:00:00+07:00",
    endsAt: "2026-11-14T15:00:00+07:00",
    state: "PAST",
  },
  {
    id: "ziarah",
    title: "Ziarah",
    description:
      "Pilgrimage & prayerful reflection along the road toward Youth Catholic Revival.",
    startsAt: "2026-11-28T07:00:00+07:00",
    endsAt: "2026-11-28T16:00:00+07:00",
    state: "NOW",
  },
  {
    id: "webinar",
    title: "Webinar",
    description:
      "Online formation session preparing hearts and minds for The Highway.",
    startsAt: "2026-12-12T10:00:00+07:00",
    endsAt: "2026-12-12T12:30:00+07:00",
    state: "UPCOMING",
  },
  {
    id: "ycr",
    title: "YCR — The Highway",
    description:
      "The main Youth Catholic Revival gathering at Universitas Ciputra.",
    startsAt: "2027-01-24T08:00:00+07:00",
    endsAt: "2027-01-24T20:00:00+07:00",
    state: "UPCOMING",
  },
];

export const MOCK_RUNDOWN: RundownSession[] = [
  {
    id: "session-1",
    title: "Gate Open & Registration Check-In",
    speaker: "Registration Committee",
    location: "Main Lobby, Universitas Ciputra",
    startsAt: "2027-01-24T08:00:00+07:00",
    endsAt: "2027-01-24T09:00:00+07:00",
  },
  {
    id: "session-2",
    title: "Opening Praise & Keynote: Walking The Highway",
    speaker: "Guest Speaker (TBD)",
    location: "Auditorium — Main Stage",
    startsAt: "2027-01-24T09:00:00+07:00",
    endsAt: "2027-01-24T11:30:00+07:00",
  },
  {
    id: "session-3",
    title: "Fellowship Lunch & Merch Booth",
    speaker: null,
    location: "Atrium & Courtyard",
    startsAt: "2027-01-24T11:30:00+07:00",
    endsAt: "2027-01-24T13:00:00+07:00",
  },
  {
    id: "session-4",
    title: "Adoration, Closing Mass & Sending Forth",
    speaker: "Campus Chaplain (TBD)",
    location: "Auditorium — Main Stage",
    startsAt: "2027-01-24T13:00:00+07:00",
    endsAt: "2027-01-24T17:00:00+07:00",
  },
];

export function isDDay(nowMs: number = Date.now()): boolean {
  return nowMs >= YCR_DATE_MIDNIGHT;
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTimeRange(startsAt: string, endsAt: string | null): string {
  const fmt = (s: string) =>
    new Date(s).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return endsAt ? `${fmt(startsAt)} – ${fmt(endsAt)} WIB` : `${fmt(startsAt)} WIB`;
}
