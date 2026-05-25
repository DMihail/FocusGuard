/** @format */

import { areAllPermissionsGranted } from '@/screen/EnablePermissions/utils/permissionStatus';
import type { RootStackParamList } from './types';

export const resolveEntryRoute = (isConfirm: boolean): keyof RootStackParamList => {
  if (!isConfirm) {
    return 'Onboarding';
  }

  if (!areAllPermissionsGranted()) {
    return 'EnablePermissions';
  }

  return 'Dashboard';
};
