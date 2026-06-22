import React, { memo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';

type IosPickAppsButtonProps = {
  isPicking: boolean;
  onPress: () => void;
};

export const IosPickAppsButton = memo(({ isPicking, onPress }: IosPickAppsButtonProps) => {
  const styles = useManageAppsStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.iosPickAppsContainer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose apps with Screen Time"
        accessibilityState={{ busy: isPicking, disabled: isPicking }}
        disabled={isPicking}
        onPress={onPress}
        style={({ pressed }) => [styles.iosPickAppsButton, (pressed || isPicking) && styles.iosPickAppsButtonPressed]}
        testID={testIds.manageApps.iosPickAppsButton}
      >
        {isPicking ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Text style={styles.iosPickAppsButtonText}>Choose Apps</Text>
        )}
      </Pressable>
      <Text style={styles.iosPickAppsHint}>Screen Time lets you pick which apps Keept should track.</Text>
    </View>
  );
});
