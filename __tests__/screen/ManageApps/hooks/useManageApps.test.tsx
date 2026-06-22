/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer from 'react-test-renderer';

import type { ManageApp } from '@/domain/types';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';

const mockGetInstalledApplications = jest.fn();

const mockStoreState: {
  apps: ManageApp[];
  toggleApp: jest.Mock;
  isSelected: (packageName: string) => boolean;
  syncSelectedAppsMetadata: jest.Mock;
} = {
  apps: [],
  toggleApp: jest.fn((app: ManageApp) => {
    const isAlreadySelected = mockStoreState.apps.some((item) => item.packageName === app.packageName);

    mockStoreState.apps = isAlreadySelected
      ? mockStoreState.apps.filter((item) => item.packageName !== app.packageName)
      : [...mockStoreState.apps, app];
  }),
  isSelected: (packageName) => mockStoreState.apps.some((app) => app.packageName === packageName),
  syncSelectedAppsMetadata: jest.fn(),
};

jest.mock('../../../../source/specs', () => ({
  getInstalledApplications: async () => mockGetInstalledApplications(),
}));

jest.mock('../../../../source/store', () => ({
  selectedAppsStore: Object.assign((selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState), {
    getState: () => mockStoreState,
  }),
}));

jest.mock('../../../../source/domain/installedAppsCatalog', () => {
  const actual = jest.requireActual('../../../../source/domain/installedAppsCatalog');

  return {
    ...actual,
    invalidateInstalledAppsCache: jest.fn(() => actual.invalidateInstalledAppsCache()),
  };
});

import { invalidateInstalledAppsCache } from '@/domain/installedAppsCatalog';
import { useManageApps } from '@/screen/ManageApps/hooks/useManageApps.android';

type HarnessProps = {
  searchQuery?: string;
  categoryId?: string;
  onReady: (value: ReturnType<typeof useManageApps>) => void;
};

const UseManageAppsHarness = ({ searchQuery = '', categoryId, onReady }: HarnessProps) => {
  const value = useManageApps();
  const valueRef = useRef(value);
  const onReadyRef = useRef(onReady);

  valueRef.current = value;
  onReadyRef.current = onReady;

  useEffect(() => {
    valueRef.current.refreshInstalledApps().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      valueRef.current.setSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (categoryId) {
      valueRef.current.setActiveCategory(categoryId);
    }
  }, [categoryId]);

  const { apps: filteredApps, isSearchActive, isFiltering, activeCategoryId } = value;

  useEffect(() => {
    onReadyRef.current(value);
  }, [filteredApps, isSearchActive, isFiltering, activeCategoryId, value]);

  return null;
};

describe('useManageApps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    invalidateInstalledAppsCache();
    mockStoreState.apps = [];
    mockGetInstalledApplications.mockReturnValue(mockInstallApps);
  });

  const flushInstalledAppsLoad = async () => {
    await ReactTestRenderer.act(async () => {
      await Promise.resolve();
    });
    await ReactTestRenderer.act(async () => {
      await Promise.resolve();
    });
  };

  it('ignores active category while search query is set', async () => {
    let hookValue: ReturnType<typeof useManageApps> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <UseManageAppsHarness
          searchQuery="chat"
          categoryId="Game"
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });
    await flushInstalledAppsLoad();

    expect(hookValue!.isSearchActive).toBe(true);
    expect(hookValue!.apps).toHaveLength(1);
    expect(hookValue!.apps[0].packageName).toBe('com.social.chat');
  });

  it('toggles selection through the store', async () => {
    let hookValue: ReturnType<typeof useManageApps> | undefined;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <UseManageAppsHarness
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });
    await flushInstalledAppsLoad();

    const targetApp = mockManageApps[0];

    await ReactTestRenderer.act(async () => {
      hookValue!.toggleAppSelection(targetApp);
    });

    await ReactTestRenderer.act(async () => {
      renderer!.update(
        <UseManageAppsHarness
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });

    expect(mockStoreState.toggleApp).toHaveBeenCalledWith(targetApp);
    expect(hookValue!.isSelected(targetApp.packageName)).toBe(true);
    expect(hookValue!.selectedApps).toHaveLength(1);
  });
});
