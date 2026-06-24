/** Local calendar day key (device timezone) for usage cache invalidation. */
export const getLocalDayKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

/** Milliseconds until the next local midnight. */
export const getMsUntilNextLocalMidnight = (date = new Date()): number => {
  const nextMidnight = new Date(date);
  nextMidnight.setHours(24, 0, 0, 0);

  return Math.max(0, nextMidnight.getTime() - date.getTime());
};
