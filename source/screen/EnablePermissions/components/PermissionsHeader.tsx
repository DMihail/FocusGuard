/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { usePermissionsStyles } from '../styles';

export const PermissionsHeader = () => {
  const styles = usePermissionsStyles();

  return (
    <View style={styles.header} testID={testIds.enablePermissions.header}>
      <Text style={styles.title}>Enable Permissions</Text>
      <Text style={styles.subtitle}>We need a few permissions to protect your focus</Text>
    </View>
  );
};
