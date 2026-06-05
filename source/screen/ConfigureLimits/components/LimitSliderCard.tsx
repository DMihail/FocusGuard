/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';

import { formatDurationMinutes } from '@/utils/usage/formatUsage';

import { useSliderTrackGesture } from '../hooks/useSliderTrackGesture';
import { configureLimitsStyles as styles } from '../styles';
import type { LimitSliderCardProps } from '../types';
import { getSliderLayout } from '../utils/sliderLayout';

export const LimitSliderCard = ({
  title,
  description,
  valueMinutes,
  minMinutes,
  progressMinMinutes,
  maxMinutes,
  stepMinutes,
  accentColor,
  onChange,
  testID,
}: LimitSliderCardProps) => {
  const progressMin = progressMinMinutes ?? minMinutes;
  const { progress, progressPercent, inactivePercent, showInactiveZone } = getSliderLayout(
    valueMinutes,
    minMinutes,
    progressMin,
    maxMinutes,
  );

  const { trackRef, panGesture, handleTrackLayout } = useSliderTrackGesture({
    valueMinutes,
    minMinutes,
    progressMinMinutes: progressMin,
    maxMinutes,
    stepMinutes,
    onChange,
  });

  const decrease = () => onChange(Math.max(minMinutes, valueMinutes - stepMinutes));
  const increase = () => onChange(Math.min(maxMinutes, valueMinutes + stepMinutes));

  return (
    <View style={styles.limitCard} testID={testID}>
      <View style={styles.limitCardHeader}>
        <View style={styles.limitCardHeaderTop}>
          <Text style={styles.limitCardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.limitCardValue, { color: accentColor }]} numberOfLines={1}>
            {formatDurationMinutes(valueMinutes)}
          </Text>
        </View>
        <Text style={styles.limitCardDescription}>{description}</Text>
      </View>

      <View style={styles.sliderRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${title}`}
          style={styles.sliderButton}
          onPress={decrease}
        >
          <Text style={styles.sliderButtonLabel}>−</Text>
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <View
            ref={trackRef}
            style={styles.sliderTrackTouch}
            collapsable={false}
            onLayout={handleTrackLayout}
            accessibilityRole="adjustable"
            accessibilityLabel={title}
            accessibilityHint="Drag horizontally on the track or tap to set the limit"
            accessibilityValue={{ text: formatDurationMinutes(valueMinutes) }}
            accessibilityActions={[
              { name: 'increment', label: 'Increase' },
              { name: 'decrement', label: 'Decrease' },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                increase();
              }
              if (event.nativeEvent.actionName === 'decrement') {
                decrease();
              }
            }}
          >
            <View style={styles.sliderTrack}>
              {showInactiveZone ? (
                <View pointerEvents="none" style={[styles.sliderTrackInactive, { width: inactivePercent }]} />
              ) : null}
              <View
                pointerEvents="none"
                style={[styles.sliderFill, { width: progressPercent, backgroundColor: accentColor }]}
              />
            </View>
            <View pointerEvents="none" style={styles.sliderThumbRail}>
              <View style={[styles.sliderThumbSpacer, { flex: progress }]} />
              <View style={[styles.sliderThumb, { backgroundColor: accentColor }]} />
              <View style={{ flex: 1 - progress }} />
            </View>
          </View>
        </GestureDetector>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${title}`}
          style={styles.sliderButton}
          onPress={increase}
        >
          <Text style={styles.sliderButtonLabel}>+</Text>
        </Pressable>
      </View>

      <View style={styles.sliderBounds}>
        <Text style={styles.sliderBoundLabel}>{formatDurationMinutes(minMinutes)}</Text>
        <Text style={styles.sliderBoundLabel}>{formatDurationMinutes(maxMinutes)}</Text>
      </View>
    </View>
  );
};
