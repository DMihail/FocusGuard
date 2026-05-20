/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PermissionsHeader } from '../../../../source/screen/EnablePermissions/components/PermissionsHeader';

describe('PermissionsHeader', () => {
  it('renders title and subtitle', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsHeader />);
    });

    expect(tree!.root.findByProps({ children: 'Enable Permissions' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'We need a few permissions to protect your focus' })).toBeDefined();
  });
});
