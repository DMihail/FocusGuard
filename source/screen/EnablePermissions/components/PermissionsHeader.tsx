/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { permissionsStyles } from '../styles';

const PermissionsHeaderView = () => (
  <View style={permissionsStyles.header} testID={testIds.enablePermissions.header}>
    <Text style={permissionsStyles.title}>Enable Permissions</Text>
    <Text style={permissionsStyles.subtitle}>We need a few permissions to protect your focus</Text>
  </View>
);

export const PermissionsHeader = memo(PermissionsHeaderView);
