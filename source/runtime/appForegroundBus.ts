import { AppState, type AppStateStatus } from 'react-native';

type AppForegroundListener = () => void;

const listeners = new Set<AppForegroundListener>();
let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

const notifyForegroundListeners = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

const attachAppStateListener = (): void => {
  if (appStateSubscription) {
    return;
  }

  appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      notifyForegroundListeners();
    }
  });
};

const detachAppStateListenerIfIdle = (): void => {
  if (listeners.size === 0 && appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};

/** Single AppState subscription shared by hooks and services. */
export const subscribeAppForeground = (listener: AppForegroundListener): (() => void) => {
  listeners.add(listener);
  attachAppStateListener();

  return () => {
    listeners.delete(listener);
    detachAppStateListenerIfIdle();
  };
};

/** @internal Test-only reset to avoid cross-test AppState listener leakage. */
export const __resetAppForegroundBusForTests = (): void => {
  listeners.clear();
  appStateSubscription?.remove();
  appStateSubscription = null;
};
