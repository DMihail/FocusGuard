/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PermissionsFooter } from '../../../../source/screen/EnablePermissions/components/PermissionsFooter';

describe('PermissionsFooter', () => {
  it('renders Continue label', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsFooter canContinue={false} onContinue={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ children: 'Continue' })).toBeDefined();
  });

  it('disables continue when permissions are incomplete', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsFooter canContinue={false} onContinue={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);
  });

  it('enables continue when all permissions are granted', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsFooter canContinue onContinue={jest.fn()} />);
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(false);
  });

  it('calls onContinue when enabled and pressed', () => {
    const onContinue = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsFooter canContinue onContinue={onContinue} />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.onPress();
    });

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
