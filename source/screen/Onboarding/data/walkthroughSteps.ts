/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import { Clock, Glare, Shield } from '../../../assets/svg';

export type WalkthroughStepData = {
  id: string;
  title: string;
  text: string;
  Icon: ComponentType<SvgProps>;
};

export const WALKTHROUGH_STEPS: WalkthroughStepData[] = [
  {
    id: 'focus',
    title: 'Track Your Focus',
    text: 'Monitor your app usage in real-time and understand where your attention goes throughout the day.',
    Icon: Shield,
  },
  {
    id: 'limits',
    title: 'Set Smart Limits',
    text: 'Configure personalized time limits with gentle warnings and hard blocks to help you stay in control.',
    Icon: Clock,
  },
  {
    id: 'habits',
    title: 'Build Better Habits',
    text: 'Track your focus score, build streaks, and celebrate your progress toward a more intentional digital life.',
    Icon: Glare,
  },
];
