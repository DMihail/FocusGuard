/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { mockDashboardAppRows } from '@/testing/fixtures/dashboard';

import { GlobalUsageHistorySync } from '@/components/GlobalUsageHistorySync';

const mockUseUsageHistorySync = jest.fn();
const mockUseCoreStoresHydrated = jest.fn(() => true);
const mockUsePersistHydrated = jest.fn(() => false);

jest.mock('@/hooks/useUsageHistorySync', () => ({
  useUsageHistorySync: (...args: unknown[]) => mockUseUsageHistorySync(...args),
}));

jest.mock('@/hooks/useCoreStoresHydrated', () => ({
  useCoreStoresHydrated: () => mockUseCoreStoresHydrated(),
}));

jest.mock('@/hooks/usePersistHydrated', () => ({
  usePersistHydrated: () => mockUsePersistHydrated(),
}));

jest.mock('@/context/SelectedDashboardAppRowsProvider', () => ({
  useSelectedDashboardAppRows: () => mockDashboardAppRows,
}));

describe('GlobalUsageHistorySync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCoreStoresHydrated.mockReturnValue(true);
    mockUsePersistHydrated.mockReturnValue(false);
  });

  it('waits for usage history hydration before enabling sync', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<GlobalUsageHistorySync enabled />);
    });

    expect(mockUseUsageHistorySync).toHaveBeenLastCalledWith(mockDashboardAppRows, false);

    act(() => {
      mockUsePersistHydrated.mockReturnValue(true);
      tree.update(<GlobalUsageHistorySync enabled />);
    });

    expect(mockUseUsageHistorySync).toHaveBeenLastCalledWith(mockDashboardAppRows, true);
  });
});
