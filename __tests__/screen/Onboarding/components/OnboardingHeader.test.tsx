/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { OnboardingHeader } from '../../../../source/screen/Onboarding/components/OnboardingHeader';

jest.mock('../../../../source/screen/Onboarding/components/ScrollIndicator', () => ({
  ScrollIndicator: () => null,
}));

describe('OnboardingHeader', () => {
  it('renders the Skip action', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingHeader indicatorProps={null} />);
    });

    expect(tree!.root.findByProps({ children: 'Skip' })).toBeDefined();
  });

  it('invokes onSkip when Skip is pressed', () => {
    const onSkip = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<OnboardingHeader indicatorProps={null} onSkip={onSkip} />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Skip onboarding' }).props.onPress();
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
