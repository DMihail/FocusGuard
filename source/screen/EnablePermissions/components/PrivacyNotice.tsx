/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { PERMISSIONS_PRIVACY_NOTICE } from '@/content/privacy';
import { testIds } from '@/testing/testIds';

import { permissionsStyles } from '../styles';

export const PrivacyNotice = () => (
  <View style={permissionsStyles.privacyBox} testID={testIds.enablePermissions.privacyNotice}>
    <Text style={permissionsStyles.privacyText}>{PERMISSIONS_PRIVACY_NOTICE}</Text>
  </View>
);
