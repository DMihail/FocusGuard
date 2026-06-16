/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer from 'react-test-renderer';

import type { ManageApp } from '@/domain/types';

const mockInstalledApps: ManageApp[] = [
  {
    tokenId: 'ios-token-0',
    packageName: 'ios-token-0',
    appName: 'Selected App 1',
    appImage: '',
    category: 'Other',
    categoryLabel: 'Other',
  },
];

const mockRefreshInstalledApps = jest.fn().mockResolvedValue(undefined);

jest.mock('@/screen/ManageApps/hooks/useInstalledAppsCatalog', () => ({
  useInstalledAppsCatalog: () => ({
    installedApps: mockInstalledApps,
    isLoadingApps: false,
    refreshInstalledApps: mockRefreshInstalledApps,
  }),
}));

jest.mock('@/store', () => ({
  selectedAppsStore: (selector: (state: unknown) => unknown) =>
    selector({
      apps: mockInstalledApps,
      toggleApp: jest.fn(),
      isSelected: () => true,
    }),
}));

import { useManageApps } from '@/screen/ManageApps/hooks/useManageApps.ios';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useManageApps>) => void;
};

const UseManageAppsHarness = ({ onReady }: HarnessProps) => {
  const value = useManageApps();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  }, [value]);

  return null;
};

describe('useManageApps.ios', () => {
  it('exposes picker selection without Android catalog filters', async () => {
    let hookValue: ReturnType<typeof useManageApps> | null = null;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<UseManageAppsHarness onReady={(value) => (hookValue = value)} />);
    });

    expect(hookValue).not.toBeNull();
    expect(hookValue!.apps).toEqual(mockInstalledApps);
    expect(hookValue!.isLoadingApps).toBe(false);
    expect(hookValue!.isFiltering).toBe(false);
    expect(hookValue!.isSearchActive).toBe(false);
    expect(hookValue!.categoryFilters).toHaveLength(1);
    expect(hookValue!.selectedCount).toBe(1);

    hookValue!.setSearchQuery();
    hookValue!.setActiveCategory();
    expect(hookValue!.isSearchActive).toBe(false);
  });
});
