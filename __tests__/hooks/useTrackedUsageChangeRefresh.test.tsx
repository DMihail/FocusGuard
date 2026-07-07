/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

const mockSubscribeTrackedUsageChanged = jest.fn((_listener: () => void) => ({ remove: jest.fn() }));
const mockRefresh = jest.fn(() => Promise.resolve());

let focusCleanup: (() => void) | undefined;

jest.mock('@/specs', () => ({
  subscribeTrackedUsageChanged: (listener: () => void) => {
    mockSubscribeTrackedUsageChanged(listener);
    return { remove: jest.fn() };
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (effect: () => void | (() => void)) => {
    focusCleanup = effect() as (() => void) | undefined;
  },
}));

import { useTrackedUsageChangeRefresh } from '@/hooks/useTrackedUsageChangeRefresh';

const Harness = ({ refresh }: { refresh: () => void | Promise<void> }) => {
  useTrackedUsageChangeRefresh(refresh);
  return null;
};

describe('useTrackedUsageChangeRefresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusCleanup = undefined;
  });

  it('subscribes on focus and refreshes when native usage changes', async () => {
    act(() => {
      ReactTestRenderer.create(<Harness refresh={mockRefresh} />);
    });

    expect(mockSubscribeTrackedUsageChanged).toHaveBeenCalledTimes(1);

    const listener = mockSubscribeTrackedUsageChanged.mock.calls[0]?.[0] as (() => void) | undefined;

    await act(async () => {
      listener?.();
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);

    act(() => {
      focusCleanup?.();
    });
  });
});
