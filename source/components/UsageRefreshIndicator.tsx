/** @format */

import React, { Activity, memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

type UsageRefreshIndicatorProps = {
  visible: boolean;
  testID?: string;
};

export const UsageRefreshIndicator = memo(({ visible, testID }: UsageRefreshIndicatorProps) => (
  <Activity mode={visible ? 'visible' : 'hidden'}>
    <View style={styles.overlay} pointerEvents="none">
      <ActivityIndicator
        size="large"
        color={colors.accent}
        accessibilityLabel="Updating usage data"
        testID={testID ?? testIds.app.usageLoader}
      />
    </View>
  </Activity>
));

UsageRefreshIndicator.displayName = 'UsageRefreshIndicator';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
  },
});
