/** @format */

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(),
}));

import { type CreateMmkv, migrateMmkvIfNeeded, type MMKV } from '@/store/migrateMmkvStorage';
import {
  LEGACY_MMKV_INSTANCE_ID,
  MMKV_INSTANCE_ID,
  MMKV_MIGRATION_FLAG_KEY,
  MMKV_MIGRATION_KEYS,
} from '@/store/persistSchema';

const createMmkvMock = (data: Record<string, string | boolean>): MMKV =>
  ({
    contains: (key: string) => key in data,
    getBoolean: (key: string) => (typeof data[key] === 'boolean' ? (data[key] as boolean) : undefined),
    getString: (key: string) => (typeof data[key] === 'string' ? (data[key] as string) : undefined),
    set: (key: string, value: boolean | string) => {
      data[key] = value;
    },
    importAllFrom: (other: MMKV) => {
      let copied = 0;

      for (const key of MMKV_MIGRATION_KEYS) {
        if (key in data) {
          continue;
        }

        const value = other.getString(key);

        if (value != null) {
          data[key] = value;
          copied += 1;
        }
      }

      return copied;
    },
  } as MMKV);

describe('migrateMmkvIfNeeded', () => {
  it('copies legacy keys into the Keept instance once', () => {
    const legacyData: Record<string, string | boolean> = {
      'selected-apps-storage': '{"state":{"apps":[]},"version":1}',
      'app-limits-storage': '{"state":{"limitsByAppKey":{}},"version":2}',
    };
    const targetData: Record<string, string | boolean> = {};

    const createMmkv = jest.fn(({ id }: { id: string }) => {
      if (id === LEGACY_MMKV_INSTANCE_ID) {
        return createMmkvMock(legacyData);
      }

      if (id === MMKV_INSTANCE_ID) {
        return createMmkvMock(targetData);
      }

      throw new Error(`Unexpected MMKV id: ${id}`);
    }) as CreateMmkv;

    migrateMmkvIfNeeded(createMmkv);
    migrateMmkvIfNeeded(createMmkv);

    expect(createMmkv).toHaveBeenCalledTimes(3);
    expect(targetData['selected-apps-storage']).toBe(legacyData['selected-apps-storage']);
    expect(targetData['app-limits-storage']).toBe(legacyData['app-limits-storage']);
    expect(targetData[MMKV_MIGRATION_FLAG_KEY]).toBe(true);
  });

  it('skips migration when the flag is already set', () => {
    const targetData: Record<string, string | boolean> = {
      [MMKV_MIGRATION_FLAG_KEY]: true,
    };

    const createMmkv = jest.fn(({ id }: { id: string }) => {
      if (id === MMKV_INSTANCE_ID) {
        return createMmkvMock(targetData);
      }

      throw new Error(`Unexpected MMKV id: ${id}`);
    }) as CreateMmkv;

    migrateMmkvIfNeeded(createMmkv);

    expect(createMmkv).toHaveBeenCalledTimes(1);
  });

  it('lists every persist key in MMKV_MIGRATION_KEYS', () => {
    expect(MMKV_MIGRATION_KEYS).toEqual(
      expect.arrayContaining([
        'selected-apps-storage',
        'app-limits-storage',
        'monitoring-storage',
        'settings-storage',
        'onboarding-storage',
        'native-tracking-snapshot-v1',
      ]),
    );
  });
});
