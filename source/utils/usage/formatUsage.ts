/** @format */

const MS_PER_MINUTE = 60_000;

/** Formats milliseconds as a compact duration (`45m`, `1h 30m`). */
export const formatUsageMinutes = (ms: number): string => {
  const minutes = Math.max(0, Math.round(ms / MS_PER_MINUTE));

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};

/** Formats used/limit pair for progress labels. */
export const formatUsagePair = (usedMs: number, limitMs: number): string =>
  `${formatUsageMinutes(usedMs)} / ${formatUsageMinutes(limitMs)}`;
