/** @format */

import React from 'react';
import { Text } from 'react-native';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { createLazyScreen } from '@/navigation/createLazyScreen';

const SampleScreen = ({ label }: { label: string }) => <Text>{label}</Text>;

describe('createLazyScreen', () => {
  it('renders the lazy-loaded screen after the dynamic import resolves', async () => {
    const LazySampleScreen = createLazyScreen(async () => ({ SampleScreen }), 'SampleScreen');

    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

    await act(async () => {
      renderer = ReactTestRenderer.create(<LazySampleScreen label="Keept" />);
      await Promise.resolve();
    });

    expect(renderer?.root.findByType(Text).props.children).toBe('Keept');
  });
});
