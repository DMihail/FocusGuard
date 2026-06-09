/** @format */

import React from 'react';
import { Text } from 'react-native';

import * as Reanimated from 'react-native-reanimated';
import ReactTestRenderer from 'react-test-renderer';

import { usePermissionCardAnimation } from '@/screen/EnablePermissions/hooks/usePermissionCardAnimation';
import type { PermissionId, PermissionStatus } from '@/screen/EnablePermissions/types';

const withTimingSpy = jest.spyOn(Reanimated, 'withTiming');
const cancelAnimationSpy = jest.spyOn(Reanimated, 'cancelAnimation');

type ProbeProps = {
  id: PermissionId;
  status: PermissionStatus;
};

const AnimationProbe = ({ id, status }: ProbeProps) => {
  const animation = usePermissionCardAnimation(id, status);
  return <Text testID="isGranted">{String(animation.isGranted)}</Text>;
};

describe('usePermissionCardAnimation', () => {
  beforeEach(() => {
    withTimingSpy.mockClear();
    cancelAnimationSpy.mockClear();
  });

  it('returns granted state for granted permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe id="usage-access" status="granted" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('true');
  });

  it('returns pending state for pending permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe id="usage-access" status="pending" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('false');
  });

  it('updates granted state when status changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe id="usage-access" status="pending" />);
    });

    ReactTestRenderer.act(() => {
      tree!.update(<AnimationProbe id="usage-access" status="granted" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('true');
  });

  it('does not restart animation when granted status is unchanged', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe id="usage-access" status="granted" />);
    });

    withTimingSpy.mockClear();

    ReactTestRenderer.act(() => {
      tree!.update(<AnimationProbe id="usage-access" status="granted" />);
    });

    expect(withTimingSpy).not.toHaveBeenCalled();
  });

  it('updates granted state when the permission id changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe id="usage-access" status="pending" />);
    });

    ReactTestRenderer.act(() => {
      tree!.update(<AnimationProbe id="display-over-apps" status="granted" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('true');
  });
});
