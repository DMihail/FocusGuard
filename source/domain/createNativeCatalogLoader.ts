import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

type CatalogLoaderState<T> = {
  cached: T | null;
  loadPromise: Promise<T> | null;
};

const runDeferred = <T>(task: () => T, fallback: T, label: string): Promise<T> =>
  new Promise((resolve) => {
    scheduleAfterInteractions(() => {
      try {
        resolve(task());
      } catch (error) {
        if (__DEV__) {
          console.warn(`[${label}] Failed to load native catalog`, error);
        }
        resolve(fallback);
      }
    });
  });

export type NativeCatalogLoader<T> = {
  getCached: () => T | null;
  invalidate: () => void;
  load: (force?: boolean) => Promise<T>;
  prefetch: () => void;
};

export const createNativeCatalogLoader = <T>(config: {
  read: () => T;
  fallback: T;
  label: string;
  onInvalidate?: () => void;
}): NativeCatalogLoader<T> => {
  const state: CatalogLoaderState<T> = {
    cached: null,
    loadPromise: null,
  };

  const invalidate = (): void => {
    state.cached = null;
    state.loadPromise = null;
    config.onInvalidate?.();
  };

  const load = (force = false): Promise<T> => {
    if (!force && state.cached !== null) {
      return Promise.resolve(state.cached);
    }

    if (!force && state.loadPromise) {
      return state.loadPromise;
    }

    state.loadPromise = runDeferred(
      () => {
        const value = config.read();
        state.cached = value;
        return value;
      },
      config.fallback,
      config.label,
    ).finally(() => {
      state.loadPromise = null;
    });

    return state.loadPromise;
  };

  return {
    getCached: () => state.cached,
    invalidate,
    load,
    prefetch: () => {
      load().catch(() => undefined);
    },
  };
};

export type NativeKeyedCatalogLoader<T extends Record<string, number>> = {
  getCached: () => T | null;
  invalidate: () => void;
  loadForKeys: (keys: readonly string[], force?: boolean) => Promise<T>;
  prefetch: (keys: readonly string[]) => void;
};

export const createNativeKeyedCatalogLoader = <T extends Record<string, number>>(config: {
  readKeys: (keys: readonly string[]) => T;
  label: string;
  onInvalidate?: () => void;
}): NativeKeyedCatalogLoader<T> => {
  const state: CatalogLoaderState<T> = {
    cached: null,
    loadPromise: null,
  };

  const pickKeys = (source: T, keys: readonly string[]): T => {
    if (keys.length === 0) {
      return {} as T;
    }

    const keySet = new Set(keys);
    const picked = {} as Record<string, number>;

    for (const key of keySet) {
      const value = source[key];

      if (value !== undefined) {
        picked[key] = value;
      }
    }

    return picked as T;
  };

  const hasAllKeys = (source: T, keys: readonly string[]): boolean => keys.every((key) => source[key] !== undefined);

  const invalidate = (): void => {
    state.cached = null;
    state.loadPromise = null;
    config.onInvalidate?.();
  };

  const loadForKeys = (keys: readonly string[], force = false): Promise<T> => {
    if (keys.length === 0) {
      return Promise.resolve({} as T);
    }

    if (!force && state.cached && hasAllKeys(state.cached, keys)) {
      return Promise.resolve(pickKeys(state.cached, keys));
    }

    if (!force && state.loadPromise) {
      return state.loadPromise.then((cached) => pickKeys(cached, keys));
    }

    state.loadPromise = runDeferred(
      () => {
        const partial = config.readKeys(keys);
        state.cached = { ...(force ? {} : state.cached ?? {}), ...partial } as T;
        return state.cached;
      },
      (force ? {} : state.cached ?? {}) as T,
      config.label,
    ).finally(() => {
      state.loadPromise = null;
    });

    return state.loadPromise.then((cached) => pickKeys(cached, keys));
  };

  return {
    getCached: () => state.cached,
    invalidate,
    loadForKeys,
    prefetch: (keys) => {
      loadForKeys(keys).catch(() => undefined);
    },
  };
};
