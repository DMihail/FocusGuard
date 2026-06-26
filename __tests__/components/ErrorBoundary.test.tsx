/** @format */

import React from 'react';
import { Text } from 'react-native';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <ErrorBoundary>
          <Text testID="child">ok</Text>
        </ErrorBoundary>,
      );
    });

    expect(tree.root.findByProps({ testID: 'child' })).toBeTruthy();
  });

  it('recovers after retry', () => {
    let shouldThrow = true;

    const MaybeThrowingChild = () => {
      if (shouldThrow) {
        throw new Error('boom');
      }

      return <Text testID="child">ok</Text>;
    };

    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <ErrorBoundary>
          <MaybeThrowingChild />
        </ErrorBoundary>,
      );
    });

    shouldThrow = false;

    act(() => {
      tree.root.findByProps({ accessibilityLabel: 'Try again' }).props.onPress();
    });

    expect(tree.root.findByProps({ testID: 'child' })).toBeTruthy();
  });
});
