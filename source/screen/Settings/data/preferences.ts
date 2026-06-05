/** @format */

import { BellIcon, LockPrivacyIcon } from '@/assets/svg/Settings';
import { colors } from '@/theme';

import type { SettingsLinkItem, SettingsToggleItem } from '../types';

export const NOTIFICATIONS_TOGGLE: SettingsToggleItem = {
  title: 'Notifications',
  description: 'Limit warnings and reminders',
  Icon: BellIcon,
  iconBackgroundColor: colors.accentIconBg,
};

export const DATA_PRIVACY_LINK: SettingsLinkItem = {
  id: 'dataPrivacy',
  title: 'Data Privacy',
  description: 'All data stored locally',
  Icon: LockPrivacyIcon,
  iconBackgroundColor: colors.successIconBg,
};
