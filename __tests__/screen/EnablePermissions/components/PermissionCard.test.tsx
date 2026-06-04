/** @format */

import React from 'react';

import ReactTestRenderer from 'react-test-renderer';

import { UsageAccess } from '@/assets/svg/EnablePermissions';

import { PermissionCard } from '@/screen/EnablePermissions/components/PermissionCard';

jest.mock('../../../../source/screen/EnablePermissions/hooks/usePermissionCardAnimation', () => ({
  usePermissionCardAnimation: (status: 'granted' | 'pending') => ({
    cardStyle: {},
    iconBoxStyle: {},
    pendingIconOpacity: status === 'pending' ? 1 : 0,
    grantedIconOpacity: status === 'granted' ? 1 : 0,
    badgeStyle: {},
    grantButtonStyle: {},
    isGranted: status === 'granted',
  }),
}));

describe('PermissionCard', () => {
  const baseProps = {
    id: 'usage-access' as const,
    title: 'Usage Access',
    description: 'Required to track app usage and enforce limits',
    Icon: UsageAccess,
  };

  it('renders permission title and description', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionCard {...baseProps} status="pending" onGrant={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ children: 'Usage Access' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Required to track app usage and enforce limits' })).toBeDefined();
  });

  it('renders grant button for pending permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionCard {...baseProps} status="pending" onGrant={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ children: 'Grant Permission' })).toBeDefined();
  });

  it('calls onGrant when grant button is pressed', () => {
    const onGrant = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionCard {...baseProps} status="pending" onGrant={onGrant} />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Usage Access' }).props.onPress();
    });

    expect(onGrant).toHaveBeenCalledTimes(1);
  });

  it('disables grant button for granted permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionCard {...baseProps} status="granted" onGrant={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Grant Usage Access' }).props.disabled).toBe(true);
  });
});
