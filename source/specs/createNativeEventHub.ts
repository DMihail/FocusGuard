type NativeEventHub<T> = {
  bootstrap: () => void;
  subscribe: (listener: (event: T) => void) => { remove: () => void };
};

export const createNativeEventHub = <T>(
  registerNativeListener: (listener: (event: T) => void) => boolean,
): NativeEventHub<T> => {
  const listeners = new Set<(event: T) => void>();
  let hasNativeSubscription = false;

  const fanOut = (event: T): void => {
    for (const listener of listeners) {
      listener(event);
    }
  };

  const bootstrap = (): void => {
    if (hasNativeSubscription) {
      return;
    }

    hasNativeSubscription = registerNativeListener(fanOut);
  };

  return {
    bootstrap,
    subscribe: (listener) => {
      bootstrap();
      listeners.add(listener);

      return {
        remove: () => {
          listeners.delete(listener);
        },
      };
    },
  };
};
