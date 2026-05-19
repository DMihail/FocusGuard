/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { Walkthrough } from '../../../../source/screen/Onboarding/components/Walkthrough';

describe('Walkthrough', () => {
  it('renders title, description, and icon', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Walkthrough title="Track Your Focus" text="Monitor your app usage." icon={<Text>ICON</Text>} />,
      );
    });

    expect(tree!.root.findByProps({ children: 'Track Your Focus' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Monitor your app usage.' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'ICON' })).toBeDefined();
  });
});
