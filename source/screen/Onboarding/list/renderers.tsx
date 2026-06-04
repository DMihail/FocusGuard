/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';

import type { WalkthroughStepData } from '../data/walkthroughSteps';

import { WalkthroughPage } from '../components/WalkthroughPage';

export const createWalkthroughPageRenderItem = (pageWidth: number): ListRenderItem<WalkthroughStepData> => {
  return ({ item }) => <WalkthroughPage item={item} width={pageWidth} />;
};
