/** @format */

import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { useTheme } from '@/hooks/useTheme';
import { testIds } from '@/testing/testIds';

import { usePermissionCardAnimation } from '../hooks/usePermissionCardAnimation';
import { usePermissionsStyles } from '../styles';
import type { PermissionId, PermissionItem } from '../types';

type PermissionCardProps = PermissionItem & {
  onGrant?: (id: PermissionId) => void;
};

const arePermissionCardPropsEqual = (previous: PermissionCardProps, next: PermissionCardProps): boolean =>
  previous.id === next.id &&
  previous.title === next.title &&
  previous.description === next.description &&
  previous.status === next.status &&
  previous.Icon === next.Icon &&
  previous.onGrant === next.onGrant;

export const PermissionCard = memo(({ id, title, description, status, Icon, onGrant }: PermissionCardProps) => {
  const styles = usePermissionsStyles();
  const { colors } = useTheme();
  const cardStyles = useMemo(
    () =>
      StyleSheet.create({
        cardWrapper: {
          position: 'relative',
        },
        cardPending: {
          ...(StyleSheet.absoluteFill as object),
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        cardGranted: {
          ...(StyleSheet.absoluteFill as object),
          backgroundColor: colors.successMuted,
          borderColor: colors.successBorder,
        },
        cardContent: {
          padding: 26,
        },
        iconBoxWrapper: {
          position: 'relative',
        },
        iconBoxPending: {
          backgroundColor: colors.accentIconBg,
        },
        iconBoxGranted: {
          ...(StyleSheet.absoluteFill as object),
          backgroundColor: colors.successIconBg,
        },
      }),
    [colors],
  );
  const { grantedOverlayStyle, pendingIconStyle, grantedIconStyle, badgeStyle, grantButtonStyle, isGranted } =
    usePermissionCardAnimation(id, status);

  const handleGrant = useCallback(() => {
    onGrant?.(id);
  }, [id, onGrant]);

  return (
    <View testID={testIds.enablePermissions.permissionCard(id)} style={cardStyles.cardWrapper}>
      <View style={[styles.card, cardStyles.cardPending]} />
      <Animated.View style={[styles.card, cardStyles.cardGranted, grantedOverlayStyle]} />

      <View style={cardStyles.cardContent}>
        <View style={styles.cardRow}>
          <View style={cardStyles.iconBoxWrapper}>
            <View style={[styles.iconBox, cardStyles.iconBoxPending]} />
            <Animated.View style={[styles.iconBox, cardStyles.iconBoxGranted, grantedOverlayStyle]} />
            <Animated.View style={[styles.iconLayer, pendingIconStyle]}>
              <Icon stroke={colors.accent} />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, grantedIconStyle]}>
              <Icon stroke={colors.success} />
            </Animated.View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Animated.View
                testID={testIds.enablePermissions.grantedBadge(id)}
                style={[styles.grantedBadge, badgeStyle]}
                pointerEvents={isGranted ? 'auto' : 'none'}
              >
                <CheckIcon />
              </Animated.View>
            </View>

            <Text style={styles.cardDescription}>{description}</Text>

            {onGrant ? (
              <Animated.View
                style={[styles.grantButtonContainer, grantButtonStyle]}
                pointerEvents={isGranted ? 'none' : 'auto'}
              >
                <Pressable
                  testID={testIds.enablePermissions.grantButton(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Grant ${title}`}
                  disabled={isGranted}
                  style={styles.grantButton}
                  onPress={handleGrant}
                >
                  <Text style={styles.grantButtonText}>Grant Permission</Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}, arePermissionCardPropsEqual);

PermissionCard.displayName = 'PermissionCard';
