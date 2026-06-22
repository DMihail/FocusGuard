/** @format */

import { LayoutAnimation } from 'react-native';

/**
 * LayoutAnimation presets. Works with Fabric (New Architecture).
 * Do not call UIManager.setLayoutAnimationEnabledExperimental — it is a no-op on New Architecture.
 */

const SECTION_LAYOUT_ANIMATION_MS = 380;

export const PERMISSION_CARD_ANIMATION_MS = 380;

type LayoutAnimationConfig = Parameters<typeof LayoutAnimation.configureNext>[0];

const configureNext = (config: LayoutAnimationConfig): void => {
  LayoutAnimation.configureNext(config);
};

/** Skips the next layout pass animation (e.g. instant theme color swap). */
export const suppressLayoutAnimation = (): void => {
  configureNext({ duration: 0, update: { type: LayoutAnimation.Types.linear } });
};

/** Section show/hide: category filters, dashboard blocks. */
export const configureSectionLayoutAnimation = (): void => {
  configureNext({
    duration: SECTION_LAYOUT_ANIMATION_MS,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  });
};
