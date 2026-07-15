/** @format */

import { useCallback, useEffect, useState } from 'react';

import { useRunOnFocusAndActive } from '@/hooks/useRunOnFocusAndActive';
import {
  checkForAccessibilityServicePermission,
  openAccessibilityServiceSettings,
  requestAccessibilityServicePermission,
  subscribePermissionsChanged,
} from '@/specs/keeptTurboModuleApi.android';

export const useAccessibilityServiceSetting = () => {
  const [systemGranted, setSystemGranted] = useState(() => checkForAccessibilityServicePermission());

  const refreshSystemGrant = useCallback(() => {
    setSystemGranted(checkForAccessibilityServicePermission());
  }, []);

  useEffect(() => {
    const subscription = subscribePermissionsChanged(refreshSystemGrant);

    return () => subscription.remove();
  }, [refreshSystemGrant]);

  useRunOnFocusAndActive(refreshSystemGrant);

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
