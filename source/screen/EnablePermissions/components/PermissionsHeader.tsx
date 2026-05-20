/** @format */

import React from 'react';
import { Text, View } from 'react-native';
import { permissionsStyles } from '../styles';

export const PermissionsHeader = () => (
  <View style={permissionsStyles.header}>
    <Text style={permissionsStyles.title}>Enable Permissions</Text>
    <Text style={permissionsStyles.subtitle}>We need a few permissions to protect your focus</Text>
  </View>
);
