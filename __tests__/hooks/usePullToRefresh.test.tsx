/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { usePullToRefresh } from '@/hooks/usePullToRefresh';

type HarnessProps = {
  onRefreshData: () => void;
  onReady: (value: ReturnType<typeof usePullToRefresh>) => void;
};

const UsePullToRefreshHarness = ({ onRefreshData, onReady }: HarnessProps) => {
  const value = usePullToRefresh(onRefreshData);
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  });

  return null;
};

describe('usePullToRefresh', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls refresh and clears refreshing state', async () => {
    const refresh = jest.fn();
    let result!: ReturnType<typeof usePullToRefresh>;

    act(() => {
      ReactTestRenderer.create(
        <UsePullToRefreshHarness onRefreshData={refresh} onReady={(value) => (result = value)} />,
      );
    });

    await act(async () => {
      result.onRefresh();
      await Promise.resolve();
    });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.refreshing).toBe(false);
  });
});
