/** @format */
import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';
export const storage = createMMKV({
  id: `focus-guard-storage`,
  mode: 'multi-process',
  readOnly: false,
  compareBeforeSet: false,
});

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
