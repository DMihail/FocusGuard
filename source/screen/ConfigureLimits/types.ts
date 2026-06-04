/** @format */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import type { ManageApp } from '@/screen/ManageApps/types';
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
  minMinutes: number;
  maxMinutes: number;
  stepMinutes: number;
  accentColor: string;
  onChange: (minutes: number) => void;
  testID?: string;
};

export type UseConfigureLimitsResult = {
  app: ManageApp | undefined;
  draft: AppLimits;
  hardBlockMin: number;
  setWarningMinutes: (minutes: number) => void;
  setHardBlockMinutes: (minutes: number) => void;
  setStrictMode: (strict: boolean) => void;
  save: () => void;
};
