/** @format */

import { LayoutAnimation, Platform, UIManager } from 'react-native';

export const SECTION_LAYOUT_ANIMATION_MS = 280;
export const PERMISSION_CARD_ANIMATION_MS = 380;

let androidLayoutAnimationEnabled = false;

/** Required once on Android for LayoutAnimation to run. */
export const ensureAndroidLayoutAnimationEnabled = (): void => {
  if (androidLayoutAnimationEnabled || Platform.OS !== 'android') {
    return;
  }

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    androidLayoutAnimationEnabled = true;
  }
};

type LayoutAnimationConfig = Parameters<typeof LayoutAnimation.configureNext>[0];

const configureNext = (config: LayoutAnimationConfig): void => {
  ensureAndroidLayoutAnimationEnabled();
  LayoutAnimation.configureNext(config);
};

/** Section show/hide: selected chips, filters, dashboard blocks. */
export const configureSectionLayoutAnimation = (): void => {
  configureNext(
    LayoutAnimation.create(
      SECTION_LAYOUT_ANIMATION_MS,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
};

/** Permission list height when cards collapse after grant. */
export const PERMISSION_CARD_LAYOUT_ANIM: LayoutAnimationConfig = {
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
