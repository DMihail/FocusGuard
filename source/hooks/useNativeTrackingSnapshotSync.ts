/** @format */

import { useEffect } from 'react';

import { startNativeTrackingSnapshotSync } from '@/store/nativeTrackingSnapshot';

/** Keeps the flat native tracking snapshot aligned with JS store state. */
export const useNativeTrackingSnapshotSync = (isEnabled: boolean): void => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    return startNativeTrackingSnapshotSync();
  }, [isEnabled]);
};
