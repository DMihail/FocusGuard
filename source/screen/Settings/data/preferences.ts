/** @format */

import { BellIcon, LockPrivacyIcon, MoonIcon } from '@/assets/svg/Settings';
import { testIds } from '@/testing/testIds';
import type { ColorPalette } from '@/theme/types';

import type { SettingsLinkItem, SettingsToggleItem } from '../types';

export const createNotificationsToggle = (colors: ColorPalette): SettingsToggleItem => ({
  title: 'Notifications',
  description: 'Limit warnings and reminders',
  Icon: BellIcon,
  iconBackgroundColor: colors.accentIconBg,
});

export const createDarkModeToggle = (colors: ColorPalette): SettingsToggleItem => ({
  title: 'Dark Mode',
  description: 'Light or dark appearance',
  Icon: MoonIcon,
  iconBackgroundColor: colors.accentMuted,
  rowTestID: testIds.settings.darkModeRow,
  toggleTestID: testIds.settings.darkModeToggle,
});

export const createDataPrivacyLink = (colors: ColorPalette): SettingsLinkItem => ({
  id: 'dataPrivacy',
  title: 'Data Privacy',
  description: 'All data stored locally',
  Icon: LockPrivacyIcon,
  iconBackgroundColor: colors.successIconBg,
});
