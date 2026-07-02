/** @format */

import { createNativeEventHub } from '@/specs/createNativeEventHub';

describe('createNativeEventHub', () => {
  it('retries native registration when the turbo module is not ready yet', () => {
    let registerAttempts = 0;
    const hub = createNativeEventHub<{ changedAtMs: number }>((listener) => {
      registerAttempts += 1;
      if (registerAttempts < 2) {
        return false;
      }

      listener({ changedAtMs: 42 });
      return true;
    });

    const listener = jest.fn();
    hub.bootstrap();
    hub.subscribe(listener);

    expect(registerAttempts).toBe(2);
    expect(listener).not.toHaveBeenCalled();

    hub.subscribe(jest.fn());
    expect(registerAttempts).toBe(2);
  });

  it('fans out native events to every JS subscriber', () => {
    let nativeListener: ((event: { changedAtMs: number }) => void) | undefined;
    const hub = createNativeEventHub<{ changedAtMs: number }>((listener) => {
      nativeListener = listener;
      return true;
    });

    const firstListener = jest.fn();
    const secondListener = jest.fn();

    hub.subscribe(firstListener);
    hub.subscribe(secondListener);

    nativeListener?.({ changedAtMs: 99 });

    expect(firstListener).toHaveBeenCalledWith({ changedAtMs: 99 });
    expect(secondListener).toHaveBeenCalledWith({ changedAtMs: 99 });
  });

  it('retries registration after bootstrap when the native module appears later', () => {
    let moduleReady = false;
    let nativeListener: ((event: { changedAtMs: number }) => void) | undefined;
    const hub = createNativeEventHub<{ changedAtMs: number }>((listener) => {
      if (!moduleReady) {
        return false;
      }

      nativeListener = listener;
      return true;
    });

    hub.bootstrap();
    hub.subscribe(jest.fn());
    expect(nativeListener).toBeUndefined();

    moduleReady = true;
    const listener = jest.fn();
    hub.subscribe(listener);

    nativeListener?.({ changedAtMs: 7 });
    expect(listener).toHaveBeenCalledWith({ changedAtMs: 7 });
  });
});
