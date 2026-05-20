/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Animated } from 'react-native';
import type { ScrollIndicatorProps } from '../../../source/screen/Onboarding/types';

const mockPager: {
  listRef: { current: null };
  steps: Array<{ id: string }>;
  step: number;
  pageWidth: number;
  isLastStep: boolean;
  isPagerReady: boolean;
  indicatorProps: ScrollIndicatorProps | null;
  handleScroll: jest.Mock;
  handleMomentumScrollEnd: jest.Mock;
  handleContinue: jest.Mock;
  handlePagerLayout: jest.Mock;
  getItemLayout: jest.Mock;
  handleScrollToIndexFailed: jest.Mock;
  onSkip: jest.Mock;
} = {
  listRef: { current: null },
  steps: [{ id: 'focus' }, { id: 'limits' }, { id: 'habits' }],
  step: 0,
  pageWidth: 390,
  isLastStep: false,
  isPagerReady: true,
  indicatorProps: { count: 3, scrollX: new Animated.Value(0), pageWidth: 390 },
  handleScroll: jest.fn(),
  handleMomentumScrollEnd: jest.fn(),
  handleContinue: jest.fn(),
  handlePagerLayout: jest.fn(),
  getItemLayout: jest.fn(),
  handleScrollToIndexFailed: jest.fn(),
  onSkip: jest.fn(),
};

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

jest.mock('../../../source/screen/Onboarding/hooks/useOnboardingPager', () => ({
  useOnboardingPager: () => mockPager,
}));

jest.mock('../../../source/screen/Onboarding/components/ScrollIndicator', () => ({
  ScrollIndicator: () => null,
}));

jest.mock('../../../source/screen/Onboarding/components/WalkthroughPager', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WalkthroughPager: () => <View testID="walkthrough-pager" />,
  };
});

import { OnboardingScreen } from '../../../source/screen/Onboarding/OnboardingScreen';

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPager.isPagerReady = true;
    mockPager.indicatorProps = { count: 3, scrollX: new Animated.Value(0), pageWidth: 390 };
  });

  it('renders header, pager, and footer', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });

    expect(tree!.root.findByProps({ children: 'Skip' })).toBeDefined();
    expect(tree!.root.findByProps({ testID: 'walkthrough-pager' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Continue' })).toBeDefined();
  });

  it('does not render pager before layout when pager is not ready', () => {
    mockPager.isPagerReady = false;
    mockPager.indicatorProps = null;

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });

    expect(tree!.root.findAllByProps({ testID: 'walkthrough-pager' })).toHaveLength(0);
  });

  it('passes onSkip to the header', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Skip onboarding' }).props.onPress();
    });

    expect(mockPager.onSkip).toHaveBeenCalledTimes(1);
  });
});
