/** @format */

const MS_PER_MINUTE = 60_000;

/** Formats minutes as a compact label (e.g. `45m`, `1h`, `1h 30m`). */
export const formatDurationMinutes = (minutes: number): string => {
  const normalizedMinutes = Math.max(0, Math.round(minutes));

  if (normalizedMinutes < 60) {
    return `${normalizedMinutes}m`;
  }

  const hours = Math.floor(normalizedMinutes / 60);
  const remainder = normalizedMinutes % 60;

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};

/** Formats milliseconds as a compact duration (`45m`, `1h 30m`). */
export const formatUsageMinutes = (ms: number): string => formatDurationMinutes(ms / MS_PER_MINUTE);

/** Formats used/limit pair for progress labels. */
export const formatUsagePair = (usedMs: number, limitMs: number): string =>
  `${formatUsageMinutes(usedMs)} / ${formatUsageMinutes(limitMs)}`;
