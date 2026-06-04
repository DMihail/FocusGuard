/** @format */

import { LayoutAnimation, Platform, UIManager } from 'react-native';

import {
  configurePermissionCardLayoutAnimation,
  configureSectionLayoutAnimation,
  ensureAndroidLayoutAnimationEnabled,
} from '@/utils/layoutAnimation';

describe('layoutAnimation', () => {
  const configureNextSpy = jest.spyOn(LayoutAnimation, 'configureNext').mockImplementation(() => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    configureNextSpy.mockRestore();
  });

  it('enables experimental layout animation on Android once', () => {
    const setExperimental = jest.fn();
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    UIManager.setLayoutAnimationEnabledExperimental = setExperimental;

    ensureAndroidLayoutAnimationEnabled();
    ensureAndroidLayoutAnimationEnabled();

    expect(setExperimental).toHaveBeenCalledTimes(1);
    expect(setExperimental).toHaveBeenCalledWith(true);

    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
    delete UIManager.setLayoutAnimationEnabledExperimental;
  });

  it('configures section and permission card animations', () => {
    configureSectionLayoutAnimation();
    configurePermissionCardLayoutAnimation();

    expect(configureNextSpy).toHaveBeenCalledTimes(2);
  });
});
