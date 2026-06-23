/** @format */

import type { TranslateFn } from '@/i18n';

/** Short notice on the permissions screen. */
export const getPermissionsPrivacyNotice = (t: TranslateFn): string => t('content.permissionsPrivacyNotice');

/** Expanded notice on the settings screen. */
export const getSettingsPrivacyBanner = (t: TranslateFn, appName: string): string =>
  t('content.settingsPrivacyBanner', { appName });
