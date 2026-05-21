/** @format */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  EnablePermissions: undefined;
  Dashboard: undefined;
  ManageApps: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
