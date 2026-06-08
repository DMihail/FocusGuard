/** @format */

import { WALKTHROUGH_STEPS } from '@/screen/Onboarding/data/walkthroughSteps';

describe('WALKTHROUGH_STEPS', () => {
  it('contains three onboarding steps', () => {
    expect(WALKTHROUGH_STEPS).toHaveLength(3);
  });

  it('uses unique ids', () => {
    const ids = WALKTHROUGH_STEPS.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('provides non-empty content and icon components', () => {
    WALKTHROUGH_STEPS.forEach((step) => {
      expect(step.title.trim().length).toBeGreaterThan(0);
      expect(step.text.trim().length).toBeGreaterThan(0);
      expect(typeof step.Icon).toBe('function');
    });
  });

  it('matches the expected step ids', () => {
    expect(WALKTHROUGH_STEPS.map((step) => step.id)).toEqual(['focus', 'limits', 'habits']);
  });
});
