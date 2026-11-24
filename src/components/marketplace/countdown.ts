export function secondsLeft(expiresAt: string, nowMs: number): number {
  const remaining = Math.ceil((Date.parse(expiresAt) - nowMs) / 1000);
  return Number.isFinite(remaining) ? Math.max(0, remaining) : 0;
}

export function formatCountdown(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
