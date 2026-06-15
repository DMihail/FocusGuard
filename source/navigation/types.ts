/** @format */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { LegalDocumentId } from '@/domain/types/legal';

export type RootStackParamList = {
  Onboarding: undefined;
  EnablePermissions: undefined;
  Dashboard: undefined;
  TrackedApps: undefined;
  ManageApps: undefined;
  ConfigureLimits: { packageName: string };
  Settings: undefined;
  LegalDocument: { documentId: LegalDocumentId };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
