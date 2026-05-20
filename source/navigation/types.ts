/** @format */

import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  EnablePermissions: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export type EnablePermissionsScreenProps = NativeStackScreenProps<RootStackParamList, 'EnablePermissions'>;
