/** @format */

const values = new Map<string, string | boolean | number>();

/** In-memory stand-in for `createMMKV()` used by Jest via `jest.setup.js`. */
export const mockMmkvStorage = {
  set: (key: string, value: boolean | string | number) => {
    values.set(key, value);
  },
  getString: (key: string) => {
    const value = values.get(key);
    return typeof value === 'string' ? value : undefined;
  },
  remove: (key: string) => {
    values.delete(key);
  },
  clear: () => {
    values.clear();
  },
};
