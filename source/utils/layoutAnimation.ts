/** @format */

import { LayoutAnimation } from 'react-native';

/**
 * LayoutAnimation presets. Works with Fabric (New Architecture).
 * Do not call UIManager.setLayoutAnimationEnabledExperimental — it is a no-op on New Architecture.
 */

const SECTION_LAYOUT_ANIMATION_MS = 380;
export { SECTION_LAYOUT_ANIMATION_MS };
export const PERMISSION_CARD_ANIMATION_MS = 380;

type LayoutAnimationConfig = Parameters<typeof LayoutAnimation.configureNext>[0];

const configureNext = (config: LayoutAnimationConfig): void => {
  LayoutAnimation.configureNext(config);
};

/** Section show/hide: selected chips, filters, dashboard blocks. */
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

/** Permission list height when cards collapse after grant. */
const PERMISSION_CARD_LAYOUT_ANIM: LayoutAnimationConfig = {
  duration: PERMISSION_CARD_ANIMATION_MS,
  update: { type: LayoutAnimation.Types.easeOut, property: LayoutAnimation.Properties.scaleY },
  delete: { type: LayoutAnimation.Types.easeOut, property: LayoutAnimation.Properties.opacity },
};

export const configurePermissionCardLayoutAnimation = (): void => {
  configureNext(PERMISSION_CARD_LAYOUT_ANIM);
};

/** Permission status sync from AppState (card content / footer). */
export const configurePermissionStatusSyncAnimation = (): void => {
  configureNext(
    LayoutAnimation.create(
      PERMISSION_CARD_ANIMATION_MS,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
};
