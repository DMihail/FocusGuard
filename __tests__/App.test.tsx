/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../source/navigation', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Navigation: () => <View testID="navigation" />,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

import App from '../source/App';

describe('App', () => {
  it('renders navigation inside the safe area provider', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<App />);
    });

    expect(tree!.root.findByProps({ testID: 'navigation' })).toBeDefined();
  });
});
