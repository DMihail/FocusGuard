/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createPermissionsStyles } from '../styles';

export const PermissionsHeader = () => {
  const styles = useThemedStyles(createPermissionsStyles);

  return (
    <View style={styles.header} testID={testIds.enablePermissions.header}>
      <Text style={styles.title}>Enable Permissions</Text>
      <Text style={styles.subtitle}>We need a few permissions to protect your focus</Text>
    </View>
  );
};
