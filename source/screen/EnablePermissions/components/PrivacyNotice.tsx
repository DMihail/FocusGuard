/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { getPermissionsPrivacyNotice } from '@/content/privacy';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { usePermissionsStyles } from '../styles';

export const PrivacyNotice = () => {
  const styles = usePermissionsStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.privacyBox} testID={testIds.enablePermissions.privacyNotice}>
      <Text style={styles.privacyText}>{getPermissionsPrivacyNotice(t)}</Text>
    </View>
  );
};
