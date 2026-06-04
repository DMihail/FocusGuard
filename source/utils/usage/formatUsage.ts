/** @format */

const MS_PER_MINUTE = 60_000;

export const formatUsageMinutes = (ms: number): string => {
  const minutes = Math.max(0, Math.round(ms / MS_PER_MINUTE));

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};

export const formatUsagePair = (usedMs: number, limitMs: number): string =>
  `${formatUsageMinutes(usedMs)} / ${formatUsageMinutes(limitMs)}`;
