/** @format */

import { PermissionsAndroid, Platform } from 'react-native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import { checkForNotificationsPermission } from '@/specs';

const ANDROID_API_TIRAMISU = 33;

/** Requests `POST_NOTIFICATIONS` on API 33+ and returns whether it is granted. */
export const requestPostNotificationsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (checkForNotificationsPermission()) {
    return true;
  }

  if (Platform.Version < ANDROID_API_TIRAMISU) {
    return true;
  }

  try {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
      title: 'Notifications',
      message: `Allow notifications so ${getAppDisplayName()} can send limit warnings and reminders.`,
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return checkForNotificationsPermission();
  }
};
