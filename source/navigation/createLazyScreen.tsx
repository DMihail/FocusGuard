/** @format */

import React, { type ComponentType, lazy, Suspense } from 'react';

import { ScreenLoadingFallback } from './ScreenLoadingFallback';

type ScreenModule<P extends object> = Record<string, ComponentType<P>>;

/**
 * Wraps a screen module in `React.lazy` + `Suspense` so Metro splits it into a separate chunk.
 * The returned component keeps the same props contract as the original screen.
 */
export const createLazyScreen = <P extends object>(
  importModule: () => Promise<ScreenModule<P>>,
  exportName: string,
): ComponentType<P> => {
  const LazyComponent = lazy(async () => {
    const module = await importModule();
    const Screen = module[exportName];

    if (!Screen) {
      throw new Error(`Lazy screen export "${exportName}" was not found`);
    }

    return { default: Screen };
  });

  const LazyScreen = (props: P) => (
    <Suspense fallback={<ScreenLoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  LazyScreen.displayName = `Lazy(${exportName})`;

  return LazyScreen;
};
