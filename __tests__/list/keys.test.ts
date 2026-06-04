/** @format */

import { keyById, keyByPackageName, keyByTitle } from '@/list/keys';

describe('list keys', () => {
  it('keyById returns item id', () => {
    expect(keyById({ id: 'usage-access' }, 0)).toBe('usage-access');
  });

  it('keyByPackageName returns package name', () => {
    expect(keyByPackageName({ packageName: 'com.example.app' }, 1)).toBe('com.example.app');
  });

  it('keyByTitle returns section title', () => {
    expect(keyByTitle({ title: 'Introduction' }, 0)).toBe('Introduction');
  });
});
