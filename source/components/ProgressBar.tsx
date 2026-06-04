/** @format */

import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { borderRadius, colors } from '@/theme';

type ProgressBarProps = {
  progress: number;
  fillColor?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
  height?: number;
};

export const ProgressBar = ({
  progress,
  fillColor = colors.accent,
  trackColor = colors.progressTrack,
  style,
  height = 6,
}: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, progress));
  const fillFlex = clamped > 0 ? clamped : 0;
  const emptyFlex = 100 - fillFlex;

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View style={styles.row}>
        {fillFlex > 0 && (
          <View
            style={{
              flex: fillFlex,
              height,
              backgroundColor: fillColor,
              borderRadius: borderRadius.pill,
            }}
          />
        )}
        {emptyFlex > 0 && <View style={{ flex: emptyFlex, height }} />}
      </View>
    </View>
  );
};

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
