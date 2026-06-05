/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer from 'react-test-renderer';

import type { ManageApp } from '@/screen/ManageApps/types';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';

const mockGetInstalledApplications = jest.fn();

const mockStoreState: {
  apps: ManageApp[];
  toggleApp: jest.Mock;
  isSelected: (packageName: string) => boolean;
} = {
  apps: [],
  toggleApp: jest.fn((app: ManageApp) => {
    const isAlreadySelected = mockStoreState.apps.some((item) => item.packageName === app.packageName);

    mockStoreState.apps = isAlreadySelected
      ? mockStoreState.apps.filter((item) => item.packageName !== app.packageName)
      : [...mockStoreState.apps, app];
  }),
  isSelected: (packageName) => mockStoreState.apps.some((app) => app.packageName === packageName),
};

jest.mock('../../../../source/specs', () => ({
  getInstalledApplications: () => mockGetInstalledApplications(),
}));

jest.mock('../../../../source/store', () => ({
  selectedAppsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

import { useManageApps } from '@/screen/ManageApps/hooks/useManageApps';

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
    mockStoreState.apps = [];
    mockGetInstalledApplications.mockReturnValue(mockInstallApps);
  });

  it('returns all installed apps by default', async () => {
    let hookValue: ReturnType<typeof useManageApps> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <UseManageAppsHarness
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });

    expect(hookValue!.apps).toHaveLength(mockManageApps.length);
    expect(hookValue!.categoryFilters[0]).toEqual({ id: 'all', label: 'All', category: 'all' });
  });

  it('filters apps by search query', async () => {
    let hookValue: ReturnType<typeof useManageApps> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <UseManageAppsHarness
          searchQuery="puzzle"
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });

    expect(hookValue!.apps).toHaveLength(1);
    expect(hookValue!.apps[0].packageName).toBe('com.game.puzzle');
  });

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

    expect(hookValue!.isSearchActive).toBe(true);
    expect(hookValue!.apps).toHaveLength(1);
    expect(hookValue!.apps[0].packageName).toBe('com.social.chat');
  });

  it('filters apps by active category', async () => {
    let hookValue: ReturnType<typeof useManageApps> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <UseManageAppsHarness
          categoryId="Social"
          onReady={(value) => {
            hookValue = value;
          }}
        />,
      );
    });

    expect(hookValue!.apps).toHaveLength(1);
    expect(hookValue!.apps[0].categoryLabel).toBe('Social');
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
