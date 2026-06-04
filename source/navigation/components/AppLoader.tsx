/** @format */

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

export const AppLoader = () => (
  <View style={styles.container} testID={testIds.app.loader}>
    <ActivityIndicator size="large" color={colors.accent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
