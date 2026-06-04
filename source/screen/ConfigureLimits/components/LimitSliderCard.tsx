/** @format */

import React, { useMemo } from 'react';
import { type DimensionValue, Pressable, Text, View } from 'react-native';

import { useSliderTrackGesture } from '../hooks/useSliderTrackGesture';
import { configureLimitsStyles as styles } from '../styles';
import type { LimitSliderCardProps } from '../types';
import { formatDurationMinutes } from '../utils/formatDuration';
import { getSliderProgress } from '../utils/sliderValueFromPosition';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const toPercentDimension = (ratio: number): DimensionValue => `${clamp01(ratio) * 100}%` as DimensionValue;

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

  const progress = useMemo(
    () => clamp01(getSliderProgress(valueMinutes, progressMin, maxMinutes)),
    [maxMinutes, progressMin, valueMinutes],
  );

  const inactiveRatio = useMemo(() => {
    if (maxMinutes <= progressMin || minMinutes <= progressMin) {
      return 0;
    }

    return clamp01((minMinutes - progressMin) / (maxMinutes - progressMin));
  }, [maxMinutes, minMinutes, progressMin]);

  const progressPercent = toPercentDimension(progress);
  const inactivePercent = toPercentDimension(inactiveRatio);

  const { trackRef, panHandlers, syncTrackMetrics } = useSliderTrackGesture({
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
        <View style={styles.limitCardTitleRow}>
          <Text style={styles.limitCardTitle}>{title}</Text>
          <Text style={styles.limitCardDescription}>{description}</Text>
        </View>
        <Text style={[styles.limitCardValue, { color: accentColor }]}>{formatDurationMinutes(valueMinutes)}</Text>
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

        <View
          ref={trackRef}
          style={styles.sliderTrackTouch}
          onLayout={syncTrackMetrics}
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
          {...panHandlers}
        >
          <View style={styles.sliderTrack}>
            {inactiveRatio > 0 ? (
              <View pointerEvents="none" style={[styles.sliderTrackInactive, { width: inactivePercent }]} />
            ) : null}
            <View
              pointerEvents="none"
              style={[styles.sliderFill, { width: progressPercent, backgroundColor: accentColor }]}
            />
          </View>
          <View
            pointerEvents="none"
            style={[styles.sliderThumb, { left: progressPercent, backgroundColor: accentColor }]}
          />
        </View>

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
