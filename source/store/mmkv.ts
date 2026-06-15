/** @format */

import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

import { MMKV_INSTANCE_ID } from './persistSchema';

/** Shared MMKV instance for Zustand persistence and native monitor config reads. */
export const storage = createMMKV({
  id: MMKV_INSTANCE_ID,
  mode: 'multi-process',
  readOnly: false,
  compareBeforeSet: false,
});

/** Zustand `StateStorage` adapter backed by MMKV. */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};
