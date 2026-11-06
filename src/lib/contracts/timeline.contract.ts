import type { EventSlug } from "./common.contract";

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  state: "PAST" | "NOW" | "UPCOMING";
}

// Tentative: the rundown is waiting on approval, so this shape may still change.
export interface RundownSession {
  id: string;
  title: string;
  speaker: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string;
}

export interface EventTimelineResponse {
  eventSlug: EventSlug;
  milestones: TimelineMilestone[];
  rundown: RundownSession[];
}
