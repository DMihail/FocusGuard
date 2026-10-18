/** @format */

import { reportError } from '@/crashlytics/reportError';
import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';

import { storage } from './mmkv';

type SyncNativeSnapshotOptions = {
  build: () => unknown;
  writeNative: (snapshotJson: string) => void;
  fallbackKey: string;
  errorLabel: string;
};

/** Dedupes identical JSON, then writes through the Turbo Module or MMKV. */
export const createNativeSnapshotSync = ({
  build,
  writeNative,
  fallbackKey,
  errorLabel,
}: SyncNativeSnapshotOptions): {
  sync: () => void;
  resetForTests: () => void;
} => {
  let lastSnapshotJson: string | null = null;

  const sync = (): void => {
    const snapshotJson = JSON.stringify(build());

    if (snapshotJson === lastSnapshotJson) {
      return;
    }

    lastSnapshotJson = snapshotJson;

    if (getKeeptTurboModule()) {
      writeNative(snapshotJson);
      return;
    }

    storage.set(fallbackKey, snapshotJson);
    reportError(`[${errorLabel}] Native module unavailable; MMKV updated without native cache invalidation.`);
  };

  const resetForTests = (): void => {
    lastSnapshotJson = null;
  };

  return { sync, resetForTests };
};
