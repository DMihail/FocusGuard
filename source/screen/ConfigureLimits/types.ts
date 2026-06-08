/** @format */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ManageApp } from '@/domain/types';
import type { RootStackParamList } from '@/navigation/types';
import type { AppLimits } from '@/store';

export type ConfigureLimitsScreenProps = NativeStackScreenProps<RootStackParamList, 'ConfigureLimits'>;

export type ConfigureLimitsHeaderProps = {
  appName: string;
  onBack: () => void;
};

export type LimitSliderCardProps = {
  title: string;
  description: string;
  valueMinutes: number;
  /** Clamps value and maps touch position to minutes. */
  minMinutes: number;
  /** Track fill/thumb scale (defaults to minMinutes). Use a fixed min so a sibling slider does not shift this thumb. */
  progressMinMinutes?: number;
  maxMinutes: number;
  stepMinutes: number;
  accentColor: string;
  onChange: (minutes: number) => void;
  testID?: string;
  decreaseTestID?: string;
  increaseTestID?: string;
  trackTestID?: string;
};

export type UseConfigureLimitsResult = {
  app: ManageApp | undefined;
  draft: AppLimits;
  hardBlockMin: number;
  usedMsToday: number;
  limitMsToday: number;
  setWarningMinutes: (minutes: number) => void;
  setHardBlockMinutes: (minutes: number) => void;
  setStrictMode: (strict: boolean) => void;
  save: () => void;
};
