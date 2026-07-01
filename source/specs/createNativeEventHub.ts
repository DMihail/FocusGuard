type NativeEventHub<T> = {
  bootstrap: () => void;
  subscribe: (listener: (event: T) => void) => { remove: () => void };
};

export const createNativeEventHub = <T>(
  registerNativeListener: (listener: (event: T) => void) => void,
): NativeEventHub<T> => {
  const listeners = new Set<(event: T) => void>();
  let hasNativeSubscription = false;

  const bootstrap = (): void => {
    if (hasNativeSubscription) {
      return;
    }

    registerNativeListener((event) => {
      for (const listener of listeners) {
        listener(event);
      }
    });
    hasNativeSubscription = true;
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
