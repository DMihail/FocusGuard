/** @format */

import React, { lazy, Suspense } from 'react';

const StatisticsScreen = lazy(() =>
  import('./StatisticsScreen').then((module) => ({ default: module.StatisticsScreen })),
);

export const LazyStatisticsScreen = (): React.ReactElement => (
  <Suspense fallback={null}>
    <StatisticsScreen />
  </Suspense>
);
