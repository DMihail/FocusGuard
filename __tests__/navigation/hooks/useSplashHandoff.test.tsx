/** @format */

import * as Reanimated from 'react-native-reanimated';
import ReactTestRenderer from 'react-test-renderer';

import { useSplashHandoff } from '@/navigation/hooks/useSplashHandoff';

const TestHarness = ({ isNavigationReady }: { isNavigationReady: boolean }) => {
  const { isSplashVisible } = useSplashHandoff(isNavigationReady);
  return isSplashVisible ? 'visible' : 'hidden';
};

describe('useSplashHandoff', () => {
  beforeEach(() => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps splash visible until navigation is ready', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<TestHarness isNavigationReady={false} />);
    });

    expect(tree!.toJSON()).toBe('visible');

    ReactTestRenderer.act(() => {
      tree!.update(<TestHarness isNavigationReady />);
    });

    expect(tree!.toJSON()).toBe('hidden');
  });
});
