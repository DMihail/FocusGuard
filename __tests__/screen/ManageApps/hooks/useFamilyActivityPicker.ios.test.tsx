/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer from 'react-test-renderer';

const mockPresentFamilyActivityPicker = jest.fn();
const mockReplaceApps = jest.fn();

jest.mock('@/specs', () => ({
  presentFamilyActivityPicker: (...args: unknown[]) => mockPresentFamilyActivityPicker(...args),
}));

jest.mock('@/store', () => ({
  selectedAppsStore: {
    getState: () => ({
      replaceApps: mockReplaceApps,
    }),
  },
}));

jest.mock('@/domain/installedAppsCatalog', () => ({
  invalidateInstalledAppsCache: jest.fn(),
}));

import { invalidateInstalledAppsCache } from '@/domain/installedAppsCatalog';
import { useFamilyActivityPicker } from '@/screen/ManageApps/hooks/useFamilyActivityPicker.ios';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useFamilyActivityPicker>) => void;
};

const UseFamilyActivityPickerHarness = ({ onReady }: HarnessProps) => {
  const value = useFamilyActivityPicker();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  }, [value]);

  return null;
};

describe('useFamilyActivityPicker.ios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPresentFamilyActivityPicker.mockResolvedValue([
      {
        tokenId: 'ios-token-0',
        packageName: 'ios-token-0',
        appName: 'Selected App 1',
        appImage: '',
        category: 'Other',
      },
    ]);
  });

  it('replaces selected apps after a successful picker session', async () => {
    let hookValue: ReturnType<typeof useFamilyActivityPicker> | null = null;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<UseFamilyActivityPickerHarness onReady={(value) => (hookValue = value)} />);
    });

    await ReactTestRenderer.act(async () => {
      await hookValue!.pickApps();
    });

    expect(mockPresentFamilyActivityPicker).toHaveBeenCalledTimes(1);
    expect(mockReplaceApps).toHaveBeenCalledWith([
      expect.objectContaining({
        tokenId: 'ios-token-0',
        packageName: 'ios-token-0',
        appName: 'Selected App 1',
      }),
    ]);
    expect(invalidateInstalledAppsCache).toHaveBeenCalledTimes(1);
    expect(hookValue!.isPicking).toBe(false);
  });
});
