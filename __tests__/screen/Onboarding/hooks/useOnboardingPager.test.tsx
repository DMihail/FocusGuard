/** @format */

import React from 'react';

import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();
const mockSetIsConfirm = jest.fn();

jest.mock('@/navigation', () => ({
  useRootNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@/store/onboardingStore', () => ({
  onboardingStore: {
    getState: () => ({
      setIsConfirm: mockSetIsConfirm,
    }),
  },
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({ width: 390, height: 844, scale: 2, fontScale: 2 }),
}));

import { useOnboardingPager } from '@/screen/Onboarding/hooks/useOnboardingPager';

const PagerProbe = ({ onReady }: { onReady: (pager: ReturnType<typeof useOnboardingPager>) => void }) => {
  const pager = useOnboardingPager();
  onReady(pager);
  return null;
};

describe('useOnboardingPager', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetIsConfirm.mockClear();
  });

  it('navigates to EnablePermissions when skip is invoked', () => {
    let pager: ReturnType<typeof useOnboardingPager> | undefined;

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <PagerProbe
          onReady={(value) => {
            pager = value;
          }}
        />,
      );
    });

    ReactTestRenderer.act(() => {
      pager!.onSkip();
    });

    expect(mockSetIsConfirm).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });
});
