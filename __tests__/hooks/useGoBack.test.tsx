/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
    canGoBack: mockCanGoBack,
  }),
}));

import { useGoBack } from '@/hooks/useGoBack';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useGoBack>) => void;
};

const UseGoBackHarness = ({ onReady }: HarnessProps) => {
  const value = useGoBack();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  });

  return null;
};

describe('useGoBack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pops the stack when back navigation is available', () => {
    mockCanGoBack.mockReturnValue(true);
    let goBack!: ReturnType<typeof useGoBack>;

    act(() => {
      ReactTestRenderer.create(<UseGoBackHarness onReady={(value) => (goBack = value)} />);
    });

    act(() => {
      goBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to Dashboard when the stack cannot go back', () => {
    mockCanGoBack.mockReturnValue(false);
    let goBack!: ReturnType<typeof useGoBack>;

    act(() => {
      ReactTestRenderer.create(<UseGoBackHarness onReady={(value) => (goBack = value)} />);
    });

    act(() => {
      goBack();
    });

    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
