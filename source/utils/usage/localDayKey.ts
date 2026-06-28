/** @format */

/** Local calendar day key (device timezone) for usage cache invalidation. */
export const getLocalDayKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

/** Parses a local day key to a comparable timestamp (noon local). */
export const parseLocalDayKey = (dayKey: string): number => {
  const [year, month, day] = dayKey.split('-').map(Number);

  return new Date(year, month - 1, day, 12, 0, 0, 0).getTime();
};

/** Sorts day keys newest-first regardless of zero-padding in month/day segments. */
export const compareLocalDayKeys = (left: string, right: string): number =>
  parseLocalDayKey(right) - parseLocalDayKey(left);

/** Milliseconds until the next local midnight. */
export const getMsUntilNextLocalMidnight = (date = new Date()): number => {
  const nextMidnight = new Date(date);
  nextMidnight.setHours(24, 0, 0, 0);

  return Math.max(0, nextMidnight.getTime() - date.getTime());
};
