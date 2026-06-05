/** @format */

import React from 'react';

import ReactTestRenderer from 'react-test-renderer';

import { UsageAccess } from '@/assets/svg/EnablePermissions';
import type { PermissionItem } from '@/screen/EnablePermissions/types';

import { PermissionListRow } from '@/screen/EnablePermissions/components/PermissionListRow';

jest.mock('../../../../source/screen/EnablePermissions/components/PermissionCard', () => {
  const { Text } = require('react-native');

  return {
    PermissionCard: ({ status, title }: { status: string; title: string }) => (
      <Text testID="permission-card-status">{`${title}:${status}`}</Text>
    ),
  };
});

const baseItem: PermissionItem = {
  id: 'usage-access',
  title: 'Usage Access',
  description: 'Track usage',
  status: 'pending',
  Icon: UsageAccess,
};

describe('PermissionListRow', () => {
  it('re-renders when permission status changes', () => {
    const onGrant = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionListRow item={baseItem} onGrant={onGrant} />);
    });

    expect(tree!.root.findByProps({ testID: 'permission-card-status' }).props.children).toBe('Usage Access:pending');

    ReactTestRenderer.act(() => {
      tree!.update(<PermissionListRow item={{ ...baseItem, status: 'granted' }} onGrant={onGrant} />);
    });

    expect(tree!.root.findByProps({ testID: 'permission-card-status' }).props.children).toBe('Usage Access:granted');
  });
});
