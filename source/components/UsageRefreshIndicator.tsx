/** @format */

import React, { Activity, memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { createStylesHook } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';
import type { Theme } from '@/theme/types';

type UsageRefreshIndicatorProps = {
  visible: boolean;
  testID?: string;
};

const createUsageRefreshIndicatorStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      backgroundColor: colors.background,
    },
  });

const useUsageRefreshIndicatorStyles = createStylesHook(createUsageRefreshIndicatorStyles);

export const UsageRefreshIndicator = memo(({ visible, testID }: UsageRefreshIndicatorProps) => {
  const styles = useUsageRefreshIndicatorStyles();
  const { colors } = useTheme();

  return (
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
  );
});

UsageRefreshIndicator.displayName = 'UsageRefreshIndicator';
