/** @format */

const booleans = new Map<string, boolean>();

export const mockMmkvStorage = {
  getBoolean: (key: string) => booleans.get(key) ?? false,
  set: (key: string, value: boolean | string | number) => {
    if (typeof value === 'boolean') {
      booleans.set(key, value);
    }
  },
  remove: (key: string) => {
    booleans.delete(key);
  },
  clear: () => {
    booleans.clear();
  },
};
