/** @format */

import type { ReactElement } from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

const mountedTrees: ReactTestRenderer.ReactTestRenderer[] = [];

export const renderTestTree = (element: ReactElement): ReactTestRenderer.ReactTestRenderer => {
  let tree!: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(element);
  });

  mountedTrees.push(tree);
  return tree;
};

export const updateTestTree = (tree: ReactTestRenderer.ReactTestRenderer, element: ReactElement): void => {
  act(() => {
    tree.update(element);
  });
};

export const runTestAct = (callback: () => void): void => {
  act(callback);
};

export const flushVirtualizedListWork = async (): Promise<void> => {
  await act(async () => {
    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  });
};

export const flushVirtualizedListTimers = (): void => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
};

export const cleanupTestTrees = (): void => {
  while (mountedTrees.length > 0) {
    const tree = mountedTrees.pop();

    if (tree) {
      act(() => {
        tree.unmount();
      });
    }
  }
};
