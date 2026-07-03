/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { CoreStoresHydrationProvider, useCoreStoresHydrated } from '@/context/CoreStoresHydrationProvider';
import { appLimitsStore, onboardingStore, selectedAppsStore } from '@/store';

const waitForCoreHydration = async (): Promise<void> => {
  await act(async () => {
    await Promise.all([
      onboardingStore.persist.rehydrate(),
      selectedAppsStore.persist.rehydrate(),
      appLimitsStore.persist.rehydrate(),
    ]);
  });
};

const HydrationProbe = ({ onChange }: { onChange: (hydrated: boolean) => void }) => {
  const hydrated = useCoreStoresHydrated();
  React.useEffect(() => {
    onChange(hydrated);
  }, [hydrated, onChange]);
  return null;
};

describe('CoreStoresHydrationProvider', () => {
  it('returns false outside the provider', () => {
    let hydrated = true;

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<HydrationProbe onChange={(value) => (hydrated = value)} />);
    });

    expect(hydrated).toBe(false);
  });

  it('returns true once core stores finish hydrating inside the provider', async () => {
    onboardingStore.setState({ isConfirm: false });
    const values: boolean[] = [];

    await act(async () => {
      ReactTestRenderer.create(
        <CoreStoresHydrationProvider>
          <HydrationProbe onChange={(value) => values.push(value)} />
        </CoreStoresHydrationProvider>,
      );
      await waitForCoreHydration();
    });

    expect(onboardingStore.persist.hasHydrated()).toBe(true);
    expect(selectedAppsStore.persist.hasHydrated()).toBe(true);
    expect(appLimitsStore.persist.hasHydrated()).toBe(true);
    expect(values.at(-1)).toBe(true);
  });
});
