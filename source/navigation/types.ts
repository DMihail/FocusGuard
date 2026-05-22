/** @format */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LegalDocumentId } from '@/screen/Legal';

export type RootStackParamList = {
  Onboarding: undefined;
  EnablePermissions: undefined;
  Dashboard: undefined;
  ManageApps: undefined;
  Settings: undefined;
  LegalDocument: { documentId: LegalDocumentId };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
