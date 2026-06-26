/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
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

describe('useCoreStoresHydrated', () => {
  it('returns true once core stores finish hydrating on a fresh install', async () => {
    onboardingStore.setState({ isConfirm: false });
    const values: boolean[] = [];

    await act(async () => {
      ReactTestRenderer.create(<HydrationProbe onChange={(value) => values.push(value)} />);
      await waitForCoreHydration();
    });

    expect(onboardingStore.persist.hasHydrated()).toBe(true);
    expect(selectedAppsStore.persist.hasHydrated()).toBe(true);
    expect(appLimitsStore.persist.hasHydrated()).toBe(true);
    expect(values.at(-1)).toBe(true);
  });
});
