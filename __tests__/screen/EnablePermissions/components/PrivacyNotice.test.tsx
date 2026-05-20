/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PrivacyNotice } from '../../../../source/screen/EnablePermissions/components/PrivacyNotice';

describe('PrivacyNotice', () => {
  it('renders privacy copy', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PrivacyNotice />);
    });

    expect(
      tree!.root.findByProps({
        children: 'All data stays on your device. We never collect or share your usage information.',
      }),
    ).toBeDefined();
  });
});
