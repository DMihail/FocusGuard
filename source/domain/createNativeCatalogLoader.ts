import { logDevWarning } from '@/utils/logDevWarning';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

type CatalogLoaderState<T> = {
  cached: T | null;
  loadPromise: Promise<T> | null;
};

type KeyedCatalogLoaderState<T extends Record<string, number>> = {
  cached: T | null;
  pendingKeys: Set<string>;
  loadChain: Promise<void>;
};

const runDeferred = <T>(task: () => T | Promise<T>, fallback: T): Promise<T> =>
  new Promise((resolve) => {
    scheduleAfterInteractions(() => {
      Promise.resolve()
        .then(task)
        .then(resolve)
        .catch((error) => {
          logDevWarning(error);
          resolve(fallback);
        });
    });
  });

type NativeCatalogLoader<T> = {
  getCached: () => T | null;
  invalidate: () => void;
  load: (force?: boolean) => Promise<T>;
  prefetch: () => void;
};

export const createNativeCatalogLoader = <T>(config: {
  read: () => T | Promise<T>;
  fallback: T;
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

    state.loadPromise = runDeferred(async () => {
      const value = await config.read();
      state.cached = value;
      return value;
    }, config.fallback).finally(() => {
      state.loadPromise = null;
    });

    return state.loadPromise;
  };

  return {
    getCached: () => state.cached,
    invalidate,
    load,
    prefetch: () => {
      load().catch(logDevWarning);
    },
  };
};

type NativeKeyedCatalogLoader<T extends Record<string, number>> = {
  getCached: () => T | null;
  invalidate: () => void;
  loadForKeys: (keys: readonly string[], force?: boolean) => Promise<T>;
  prefetch: (keys: readonly string[]) => void;
};

export const createNativeKeyedCatalogLoader = <T extends Record<string, number>>(config: {
  readKeys: (keys: readonly string[]) => T | Promise<T>;
  onInvalidate?: () => void;
}): NativeKeyedCatalogLoader<T> => {
  const state: KeyedCatalogLoaderState<T> = {
    cached: null,
    pendingKeys: new Set(),
    loadChain: Promise.resolve(),
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
    state.pendingKeys.clear();
    state.loadChain = Promise.resolve();
    config.onInvalidate?.();
  };

  const enqueueLoad = (): Promise<void> => {
    state.loadChain = state.loadChain.then(async () => {
      let missing = [...state.pendingKeys].filter((key) => state.cached?.[key] === undefined);
      state.pendingKeys.clear();

      while (missing.length > 0) {
        const partial = await runDeferred(() => config.readKeys(missing), {} as T);
        state.cached = { ...(state.cached ?? {}), ...partial } as T;

        missing = [...state.pendingKeys].filter((key) => state.cached?.[key] === undefined);
        state.pendingKeys.clear();
      }
    });

    return state.loadChain;
  };

  const loadForKeys = (keys: readonly string[], force = false): Promise<T> => {
    if (keys.length === 0) {
      return Promise.resolve({} as T);
    }

    if (force) {
      state.cached = null;
      config.onInvalidate?.();
    }

    if (!force && state.cached && hasAllKeys(state.cached, keys)) {
      return Promise.resolve(pickKeys(state.cached, keys));
    }

    for (const key of keys) {
      state.pendingKeys.add(key);
    }

    return enqueueLoad().then(() => pickKeys(state.cached ?? ({} as T), keys));
  };

  return {
    getCached: () => state.cached,
    invalidate,
    loadForKeys,
    prefetch: (keys) => {
      loadForKeys(keys).catch(logDevWarning);
    },
  };
};
