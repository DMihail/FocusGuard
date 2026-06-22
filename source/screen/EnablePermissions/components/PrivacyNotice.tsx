/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { PERMISSIONS_PRIVACY_NOTICE } from '@/content/privacy';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createPermissionsStyles } from '../styles';

export const PrivacyNotice = () => {
  const styles = useThemedStyles(createPermissionsStyles);

  return (
    <View style={styles.privacyBox} testID={testIds.enablePermissions.privacyNotice}>
      <Text style={styles.privacyText}>{PERMISSIONS_PRIVACY_NOTICE}</Text>
    </View>
  );
};
