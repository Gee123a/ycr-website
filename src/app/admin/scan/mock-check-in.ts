"use server";

import { z } from "zod";
import type { CheckInResult } from "@/lib/contracts";
import { getAdminDashboard } from "../mock-dashboard";

const TicketCodeSchema = z.string().trim().min(1).max(200);

// shortcut: check-ins live in this server's memory and reset on restart; DV07 swaps in Sean's verify_and_checkin_ticket,
// which must also confirm the caller is a committee member.
const checkIns = new Map<string, string>();

export async function checkInTicket(rawCode: string): Promise<CheckInResult> {
  const code = TicketCodeSchema.safeParse(rawCode);
  if (!code.success) return { status: "NOT_FOUND" };

  const { participants } = await getAdminDashboard();
  const participant = participants.find(({ ticketCode }) => ticketCode === code.data);
  if (!participant) return { status: "NOT_FOUND" };

  const { fullName, eventSlug, tierName } = participant;
  const earlier = participant.checkedInAt ?? checkIns.get(code.data);
  if (earlier) return { status: "ALREADY_CHECKED_IN", fullName, eventSlug, tierName, checkedInAt: earlier };

  const checkedInAt = new Date().toISOString();
  checkIns.set(code.data, checkedInAt);
  return { status: "CHECKED_IN", fullName, eventSlug, tierName, checkedInAt };
}
