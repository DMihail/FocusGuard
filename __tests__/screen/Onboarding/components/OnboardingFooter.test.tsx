/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { OnboardingFooter } from '@/screen/Onboarding/components/OnboardingFooter';

jest.mock('../../../../source/screen/Onboarding/components/ScrollIndicator', () => ({
  ScrollIndicator: () => null,
}));

describe('OnboardingFooter', () => {
  it('renders Continue on non-final steps', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <OnboardingFooter isLastStep={false} indicatorProps={null} onContinue={jest.fn()} />,
      );
    });

    expect(tree!.root.findByProps({ children: 'Continue' })).toBeDefined();
  });

  it('renders Get Started on the final step', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingFooter isLastStep indicatorProps={null} onContinue={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ children: 'Get Started' })).toBeDefined();
  });

  it('calls onContinue when the button is pressed', () => {
    const onContinue = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <OnboardingFooter isLastStep={false} indicatorProps={null} onContinue={onContinue} />,
      );
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.onPress();
    });

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
