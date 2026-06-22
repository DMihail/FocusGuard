/** @format */

import React, { Activity, memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { testIds } from '@/testing/testIds';

type UsageRefreshIndicatorProps = {
  visible: boolean;
  testID?: string;
};

export const UsageRefreshIndicator = memo(({ visible, testID }: UsageRefreshIndicatorProps) => {
  const { colors } = useTheme();

  return (
    <Activity mode={visible ? 'visible' : 'hidden'}>
      <View style={[styles.overlay, { backgroundColor: colors.background }]} pointerEvents="none">
        <ActivityIndicator
          size="large"
          color={colors.accent}
          accessibilityLabel="Updating usage data"
          testID={testID ?? testIds.app.usageLoader}
        />
      </View>
    </Activity>
  );
});

UsageRefreshIndicator.displayName = 'UsageRefreshIndicator';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
