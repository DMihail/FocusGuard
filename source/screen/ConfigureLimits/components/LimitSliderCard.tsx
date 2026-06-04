/** @format */

import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { configureLimitsStyles as styles } from '../styles';
import type { LimitSliderCardProps } from '../types';
import { formatDurationMinutes } from '../utils/formatDuration';

export const LimitSliderCard = ({
  title,
  description,
  valueMinutes,
  minMinutes,
  maxMinutes,
  stepMinutes,
  accentColor,
  onChange,
  testID,
}: LimitSliderCardProps) => {
  const progress = useMemo(() => {
    if (maxMinutes <= minMinutes) {
      return 1;
    }

    return (valueMinutes - minMinutes) / (maxMinutes - minMinutes);
  }, [maxMinutes, minMinutes, valueMinutes]);

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

        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
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
