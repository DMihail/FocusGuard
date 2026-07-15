/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

const mockCheckForAccessibilityServicePermission = jest.fn(() => false);
const mockRequestAccessibilityServicePermission = jest.fn();
const mockOpenAccessibilityServiceSettings = jest.fn();

jest.mock('@/specs/keeptTurboModuleApi.android', () => ({
  checkForAccessibilityServicePermission: () => mockCheckForAccessibilityServicePermission(),
  requestAccessibilityServicePermission: () => mockRequestAccessibilityServicePermission(),
  openAccessibilityServiceSettings: () => mockOpenAccessibilityServiceSettings(),
  subscribePermissionsChanged: () => ({ remove: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => {
  const { useEffect: mockUseEffect } = require('react');

  return {
    useFocusEffect: (callback: () => void) => {
      mockUseEffect(() => {
        callback();
      }, [callback]);
    },
  };
});

import { useAccessibilityServiceSetting } from '@/screen/Settings/hooks/useAccessibilityServiceSetting.android';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useAccessibilityServiceSetting>) => void;
};

const UseAccessibilityServiceSettingHarness = ({ onReady }: HarnessProps) => {
  const value = useAccessibilityServiceSetting();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  });

  return null;
};

describe('useAccessibilityServiceSetting.android', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForAccessibilityServicePermission.mockReturnValue(false);
  });

  it('reflects native accessibility grant in isEnabled', () => {
    mockCheckForAccessibilityServicePermission.mockReturnValue(true);
    let result!: ReturnType<typeof useAccessibilityServiceSetting>;

    act(() => {
      ReactTestRenderer.create(<UseAccessibilityServiceSettingHarness onReady={(value) => (result = value)} />);
    });

    expect(result.isEnabled).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it('opens accessibility settings when toggled off', () => {
    mockCheckForAccessibilityServicePermission.mockReturnValue(true);
    let result!: ReturnType<typeof useAccessibilityServiceSetting>;

    act(() => {
      ReactTestRenderer.create(<UseAccessibilityServiceSettingHarness onReady={(value) => (result = value)} />);
    });

    act(() => {
      result.setEnabled(false);
    });

    expect(mockOpenAccessibilityServiceSettings).toHaveBeenCalledTimes(1);
    expect(mockRequestAccessibilityServicePermission).not.toHaveBeenCalled();
  });

  it('requests accessibility grant when toggled on', () => {
    let result!: ReturnType<typeof useAccessibilityServiceSetting>;

    act(() => {
      ReactTestRenderer.create(<UseAccessibilityServiceSettingHarness onReady={(value) => (result = value)} />);
    });

    act(() => {
      result.setEnabled(true);
    });

    expect(mockRequestAccessibilityServicePermission).toHaveBeenCalledTimes(1);
    expect(mockOpenAccessibilityServiceSettings).not.toHaveBeenCalled();
  });
});
