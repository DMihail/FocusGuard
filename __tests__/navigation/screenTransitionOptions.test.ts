/** @format */

import { rootScreenTransitionOptions } from '@/navigation/screenTransitionOptions';
import { colors } from '@/theme';

describe('screenTransitionOptions', () => {
  it('keeps headers hidden and uses the app background for all routes', () => {
    for (const options of Object.values(rootScreenTransitionOptions)) {
      expect(options.headerShown).toBe(false);
      expect(options.contentStyle).toEqual({ backgroundColor: colors.background });
    }
  });

  it('uses fade transitions for onboarding flow screens', () => {
    expect(rootScreenTransitionOptions.onboarding.animation).toBe('fade');
    expect(rootScreenTransitionOptions.enablePermissions.animation).toBe('fade');
    expect(rootScreenTransitionOptions.dashboard.animation).toBe('fade');
  });

  it('uses modal presentation for settings', () => {
    expect(rootScreenTransitionOptions.settings.presentation).toBe('modal');
    expect(rootScreenTransitionOptions.settings.animation).toBe('slide_from_bottom');
  });
});
