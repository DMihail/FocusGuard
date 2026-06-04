/** @format */

/** Formats minutes as a compact label (e.g. `45m`, `1h`, `1h 30m`). */
export const formatDurationMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
};
