/** @format */

import { spacing } from '@/theme';

const CHART_Y_AXIS_WIDTH = 36;

export const CHART_BAR_HEIGHT = 168;
export const CHART_LINE_HEIGHT = 148;
/** Reserved inside gifted-charts; real labels render via ChartXAxisLabels. */
export const CHART_HIDDEN_X_AXIS_HEIGHT = 4;

export { CHART_Y_AXIS_WIDTH };

/** Width available for gifted-charts inside a statistics card. */
export const getStatisticsChartWidth = (windowWidth: number): number =>
  windowWidth - spacing.xl * 2 - spacing.lg * 2 - CHART_Y_AXIS_WIDTH;
