/** @format */

import { createMMKV, type MMKV } from 'react-native-mmkv';

import {
  LEGACY_MMKV_INSTANCE_ID,
  MMKV_INSTANCE_ID,
  MMKV_MIGRATION_FLAG_KEY,
  MMKV_MIGRATION_KEYS,
} from './persistSchema';

type CreateMmkv = typeof createMMKV;

/** Copies legacy FocusGuard MMKV data into the Keept instance once per install. */
export const migrateMmkvIfNeeded = (createMmkv: CreateMmkv = createMMKV): void => {
  const target = createMmkv({ id: MMKV_INSTANCE_ID, mode: 'multi-process' });

  if (target.getBoolean(MMKV_MIGRATION_FLAG_KEY)) {
    return;
  }

  const legacy = createMmkv({ id: LEGACY_MMKV_INSTANCE_ID, mode: 'multi-process' });

  const imported = target.importAllFrom(legacy);

  if (imported === 0) {
    for (const key of MMKV_MIGRATION_KEYS) {
      if (target.contains(key)) {
        continue;
      }

      const value = legacy.getString(key);

      if (value != null) {
        target.set(key, value);
      }
    }
  }

  target.set(MMKV_MIGRATION_FLAG_KEY, true);
};

export type { CreateMmkv, MMKV };
