/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { ProgressBar } from '@/components/ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing for partial and full progress', () => {
    act(() => {
      ReactTestRenderer.create(<ProgressBar progress={50} />);
      ReactTestRenderer.create(<ProgressBar progress={100} />);
      ReactTestRenderer.create(<ProgressBar progress={0} />);
    });
  });
});
