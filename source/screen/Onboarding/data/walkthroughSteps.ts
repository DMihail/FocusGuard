/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import { Clock, Glare, Shield } from '@/assets/svg';
import type { TranslateFn } from '@/i18n';

export type WalkthroughStepData = {
  id: string;
  title: string;
  text: string;
  Icon: ComponentType<SvgProps>;
};

export const createWalkthroughSteps = (t: TranslateFn): WalkthroughStepData[] => [
  {
    id: 'focus',
    title: t('onboarding.steps.focus.title'),
    text: t('onboarding.steps.focus.text'),
    Icon: Shield,
  },
  {
    id: 'limits',
    title: t('onboarding.steps.limits.title'),
    text: t('onboarding.steps.limits.text'),
    Icon: Clock,
  },
  {
    id: 'habits',
    title: t('onboarding.steps.habits.title'),
    text: t('onboarding.steps.habits.text'),
    Icon: Glare,
  },
];
