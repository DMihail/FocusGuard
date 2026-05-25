/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Animated, Text } from 'react-native';
import { usePermissionCardAnimation } from '@/screen/EnablePermissions/hooks/usePermissionCardAnimation';
import type { PermissionStatus } from '@/screen/EnablePermissions/types';

const timingStart = jest.fn();
const compositeAnimation = {
  start: timingStart,
  stop: jest.fn(),
  reset: jest.fn(),
};

jest.spyOn(Animated, 'timing').mockImplementation(() => compositeAnimation);

type ProbeProps = {
  status: PermissionStatus;
};

const AnimationProbe = ({ status }: ProbeProps) => {
  const animation = usePermissionCardAnimation(status);
  return <Text testID="isGranted">{String(animation.isGranted)}</Text>;
};

describe('usePermissionCardAnimation', () => {
  beforeEach(() => {
    timingStart.mockClear();
  });

  it('returns granted state for granted permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe status="granted" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('true');
  });

  it('returns pending state for pending permissions', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe status="pending" />);
    });

    expect(tree!.root.findByProps({ testID: 'isGranted' }).props.children).toBe('false');
  });

  it('starts animation when status changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AnimationProbe status="pending" />);
    });

    ReactTestRenderer.act(() => {
      tree!.update(<AnimationProbe status="granted" />);
    });

    expect(timingStart).toHaveBeenCalled();
  });
});
