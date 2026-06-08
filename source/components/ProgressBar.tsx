/** @format */

import React, { memo } from 'react';
import {
  type AccessibilityRole,
  type AccessibilityValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { borderRadius, colors } from '@/theme';

type ProgressBarProps = {
  progress: number;
  fillColor?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
  height?: number;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityValue?: AccessibilityValue;
} & Pick<ViewProps, 'accessible' | 'importantForAccessibility'>;

const areProgressBarPropsEqual = (previous: ProgressBarProps, next: ProgressBarProps): boolean =>
  previous.progress === next.progress &&
  previous.fillColor === next.fillColor &&
  previous.trackColor === next.trackColor &&
  previous.style === next.style &&
  previous.height === next.height &&
  previous.accessibilityRole === next.accessibilityRole &&
  previous.accessibilityLabel === next.accessibilityLabel &&
  previous.accessible === next.accessible &&
  previous.importantForAccessibility === next.importantForAccessibility &&
  previous.accessibilityValue?.min === next.accessibilityValue?.min &&
  previous.accessibilityValue?.max === next.accessibilityValue?.max &&
  previous.accessibilityValue?.now === next.accessibilityValue?.now &&
  previous.accessibilityValue?.text === next.accessibilityValue?.text;

export const ProgressBar = memo(
  ({
    progress,
    fillColor = colors.accent,
    trackColor = colors.progressTrack,
    style,
    height = 6,
    accessibilityRole,
    accessibilityLabel,
    accessibilityValue,
    accessible,
    importantForAccessibility,
  }: ProgressBarProps) => {
    const clamped = Math.max(0, Math.min(100, progress));
    const fillFlex = clamped > 0 ? clamped : 0;
    const emptyFlex = 100 - fillFlex;

    return (
      <View
        accessible={accessible ?? Boolean(accessibilityRole ?? accessibilityLabel)}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={accessibilityValue}
        importantForAccessibility={importantForAccessibility}
        style={[styles.track, { height, backgroundColor: trackColor }, style]}
      >
        <View style={styles.row}>
          {fillFlex > 0 ? (
            <View
              style={{
                flex: fillFlex,
                height,
                backgroundColor: fillColor,
                borderRadius: borderRadius.pill,
              }}
            />
          ) : null}
          {emptyFlex > 0 ? <View style={{ flex: emptyFlex, height }} /> : null}
        </View>
      </View>
    );
  },
  areProgressBarPropsEqual,
);

const styles = StyleSheet.create({
  track: {
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
  },
});
