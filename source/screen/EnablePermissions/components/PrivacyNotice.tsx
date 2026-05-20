/** @format */

import React from 'react';
import { Text, View } from 'react-native';
import { permissionsStyles } from '../styles';

export const PrivacyNotice = () => (
  <View style={permissionsStyles.privacyBox}>
    <Text style={permissionsStyles.privacyText}>
      All data stays on your device. We never collect or share your usage information.
    </Text>
  </View>
);
