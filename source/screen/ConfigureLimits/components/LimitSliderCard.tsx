/** @format */

import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';

import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTranslation } from '@/i18n';

import { useSliderTrackGesture } from '../hooks/useSliderTrackGesture';
import { useConfigureLimitsStyles } from '../styles';
import type { LimitSliderCardProps } from '../types';
import { getSliderLayout } from '../utils/sliderLayout';

const areLimitSliderCardPropsEqual = (previous: LimitSliderCardProps, next: LimitSliderCardProps): boolean =>
  previous.title === next.title &&
  previous.description === next.description &&
  previous.valueMinutes === next.valueMinutes &&
  previous.minMinutes === next.minMinutes &&
  previous.progressMinMinutes === next.progressMinMinutes &&
  previous.maxMinutes === next.maxMinutes &&
  previous.stepMinutes === next.stepMinutes &&
  previous.accentColor === next.accentColor &&
  previous.onChange === next.onChange &&
  previous.testID === next.testID &&
  previous.decreaseTestID === next.decreaseTestID &&
  previous.increaseTestID === next.increaseTestID &&
  previous.trackTestID === next.trackTestID;

export const LimitSliderCard = memo(
  ({
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
    decreaseTestID,
    increaseTestID,
    trackTestID,
  }: LimitSliderCardProps) => {
    const styles = useConfigureLimitsStyles();
    const { t } = useTranslation();
    const { formatDurationMinutes } = useFormatUsage();
    const sliderAccessibilityActions = useMemo(
      () => [
        { name: 'increment' as const, label: t('common.increase') },
        { name: 'decrement' as const, label: t('common.decrease') },
      ],
      [t],
    );
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

    const decrease = useCallback(() => {
      onChange(Math.max(minMinutes, valueMinutes - stepMinutes));
    }, [minMinutes, onChange, stepMinutes, valueMinutes]);

    const increase = useCallback(() => {
      onChange(Math.min(maxMinutes, valueMinutes + stepMinutes));
    }, [maxMinutes, onChange, stepMinutes, valueMinutes]);

    const handleAccessibilityAction = useCallback(
      (event: { nativeEvent: { actionName: string } }) => {
        if (event.nativeEvent.actionName === 'increment') {
          increase();
        }
        if (event.nativeEvent.actionName === 'decrement') {
          decrease();
        }
      },
      [decrease, increase],
    );

    return (
      <View style={styles.limitCard} testID={testID}>
        <View style={styles.limitCardHeader}>
          <View style={styles.limitCardHeaderTop}>
            <Text accessibilityRole="header" style={styles.limitCardTitle} numberOfLines={1}>
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
            accessibilityLabel={t('configureLimits.sliderA11y', { action: t('common.decrease'), title })}
            style={styles.sliderButton}
            onPress={decrease}
            testID={decreaseTestID}
          >
            <Text style={styles.sliderButtonLabel}>−</Text>
          </Pressable>

          <GestureDetector gesture={panGesture}>
            <View
              ref={trackRef}
              style={styles.sliderTrackTouch}
              collapsable={false}
              onLayout={handleTrackLayout}
              testID={trackTestID}
              accessibilityRole="adjustable"
              accessibilityLabel={title}
              accessibilityHint={t('configureLimits.sliderHint')}
              accessibilityValue={{ text: formatDurationMinutes(valueMinutes) }}
              accessibilityActions={sliderAccessibilityActions}
              onAccessibilityAction={handleAccessibilityAction}
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
            accessibilityLabel={t('configureLimits.sliderA11y', { action: t('common.increase'), title })}
            style={styles.sliderButton}
            onPress={increase}
            testID={increaseTestID}
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
  },
  areLimitSliderCardPropsEqual,
);
