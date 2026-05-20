/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();

jest.mock('../../../../source/navigation', () => ({
  useRootNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({ width: 390, height: 844, scale: 2, fontScale: 2 }),
}));

import { useOnboardingPager } from '../../../../source/screen/Onboarding/hooks/useOnboardingPager';

const PagerProbe = ({ onReady }: { onReady: (pager: ReturnType<typeof useOnboardingPager>) => void }) => {
  const pager = useOnboardingPager();
  onReady(pager);
  return null;
};

describe('useOnboardingPager', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
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

    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });
});
