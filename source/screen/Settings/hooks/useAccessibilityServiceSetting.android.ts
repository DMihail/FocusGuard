/** @format */

import { useCallback, useState } from 'react';

import { useNativePermissionsChangedRefresh } from '@/hooks/useNativePermissionsChangedRefresh';
import {
  checkForAccessibilityServicePermission,
  openAccessibilityServiceSettings,
  requestAccessibilityServicePermission,
} from '@/specs/keeptTurboModuleApi.android';

export const useAccessibilityServiceSetting = () => {
  const [systemGranted, setSystemGranted] = useState(() => checkForAccessibilityServicePermission());

  const refreshSystemGrant = useCallback(() => {
    setSystemGranted(checkForAccessibilityServicePermission());
  }, []);

  useNativePermissionsChangedRefresh(refreshSystemGrant);

  const setEnabled = useCallback((value: boolean) => {
    if (value) {
      requestAccessibilityServicePermission();
      return;
    }

    openAccessibilityServiceSettings();
  }, []);

  return {
    isEnabled: systemGranted,
    setEnabled,
    isSupported: true,
  };
};
