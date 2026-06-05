/** @format */

export const getSliderProgress = (valueMinutes: number, progressMinMinutes: number, maxMinutes: number): number => {
  if (maxMinutes <= progressMinMinutes) {
    return 1;
  }

  return (valueMinutes - progressMinMinutes) / (maxMinutes - progressMinMinutes);
};

/** Maps touch X on the track (px) to a stepped minute value. */
export const sliderValueFromPosition = (
  positionX: number,
  trackWidth: number,
  minMinutes: number,
  maxMinutes: number,
  stepMinutes: number,
  visualMinMinutes?: number,
): number => {
  const visualMin = visualMinMinutes ?? minMinutes;

  if (trackWidth <= 0 || maxMinutes <= minMinutes) {
    return minMinutes;
  }

  const visualSpan = maxMinutes - visualMin;
  if (visualSpan <= 0) {
    return minMinutes;
  }

  const activeStartX = ((minMinutes - visualMin) / visualSpan) * trackWidth;
  const activeWidth = trackWidth - activeStartX;

  if (activeWidth <= 0) {
    return minMinutes;
  }

  const clampedX = Math.min(trackWidth, Math.max(activeStartX, positionX));
  const ratio = (clampedX - activeStartX) / activeWidth;
  const raw = minMinutes + ratio * (maxMinutes - minMinutes);
  const stepped = Math.round(raw / stepMinutes) * stepMinutes;

  return Math.min(maxMinutes, Math.max(minMinutes, stepped));
};
