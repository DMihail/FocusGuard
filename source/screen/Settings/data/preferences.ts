/** @format */

import { AccessibilityServiceIcon } from '@/assets/svg/EnablePermissions';
import { BellIcon, GlobeIcon, LockPrivacyIcon, MoonIcon } from '@/assets/svg/Settings';
import type { TranslateFn } from '@/i18n/types';
import { testIds } from '@/testing/testIds';
import type { ColorPalette } from '@/theme/types';

import type { SettingsLinkItem, SettingsToggleItem } from '../types';

export const createNotificationsToggle = (colors: ColorPalette, t: TranslateFn): SettingsToggleItem => ({
  title: t('settings.notifications.title'),
  description: t('settings.notifications.description'),
  Icon: BellIcon,
  iconBackgroundColor: colors.accentIconBg,
});

export const createAccessibilityServiceToggle = (colors: ColorPalette, t: TranslateFn): SettingsToggleItem => ({
  title: t('settings.accessibilityService.title'),
  description: t('settings.accessibilityService.description'),
  Icon: AccessibilityServiceIcon,
  iconBackgroundColor: colors.accentIconBg,
  rowTestID: testIds.settings.accessibilityServiceRow,
  toggleTestID: testIds.settings.accessibilityServiceToggle,
});

export const createDarkModeToggle = (colors: ColorPalette, t: TranslateFn): SettingsToggleItem => ({
  title: t('settings.darkMode.title'),
  description: t('settings.darkMode.descriptionDefault'),
  Icon: MoonIcon,
  iconBackgroundColor: colors.accentMuted,
  rowTestID: testIds.settings.darkModeRow,
  toggleTestID: testIds.settings.darkModeToggle,
});

export const createDataPrivacyLink = (colors: ColorPalette, t: TranslateFn): SettingsLinkItem => ({
  id: 'dataPrivacy',
  title: t('settings.dataPrivacy.title'),
  description: t('settings.dataPrivacy.description'),
  Icon: LockPrivacyIcon,
  iconBackgroundColor: colors.successIconBg,
  iconStrokeColor: colors.success,
});

export const createLanguageLink = (colors: ColorPalette, t: TranslateFn, description: string): SettingsLinkItem => ({
  id: 'language',
  title: t('settings.language.title'),
  description,
  Icon: GlobeIcon,
  iconBackgroundColor: colors.accentMuted,
  iconStrokeColor: colors.accentOnContainer,
});
