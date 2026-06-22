/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { PERMISSIONS_PRIVACY_NOTICE } from '@/content/privacy';
import { testIds } from '@/testing/testIds';

import { usePermissionsStyles } from '../styles';

export const PrivacyNotice = () => {
  const styles = usePermissionsStyles();

  return (
    <View style={styles.privacyBox} testID={testIds.enablePermissions.privacyNotice}>
      <Text style={styles.privacyText}>{PERMISSIONS_PRIVACY_NOTICE}</Text>
    </View>
  );
};
