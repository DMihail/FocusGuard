import React, { memo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { manageAppsStyles } from '../styles';

type IosPickAppsButtonProps = {
  isPicking: boolean;
  onPress: () => void;
};

export const IosPickAppsButton = memo(({ isPicking, onPress }: IosPickAppsButtonProps) => (
  <View style={manageAppsStyles.iosPickAppsContainer}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Choose apps with Screen Time"
      accessibilityState={{ busy: isPicking, disabled: isPicking }}
      disabled={isPicking}
      onPress={onPress}
      style={({ pressed }) => [
        manageAppsStyles.iosPickAppsButton,
        (pressed || isPicking) && manageAppsStyles.iosPickAppsButtonPressed,
      ]}
      testID={testIds.manageApps.iosPickAppsButton}
    >
      {isPicking ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <Text style={manageAppsStyles.iosPickAppsButtonText}>Choose Apps</Text>
      )}
    </Pressable>
    <Text style={manageAppsStyles.iosPickAppsHint}>Screen Time lets you pick which apps Keept should track.</Text>
  </View>
));
