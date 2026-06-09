/** @format */

import React, { Activity, memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { usePermissionCardAnimation } from '../hooks/usePermissionCardAnimation';
import { permissionsStyles } from '../styles';
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
  const { grantedOverlayStyle, pendingIconStyle, grantedIconStyle, badgeStyle, grantButtonStyle, isGranted } =
    usePermissionCardAnimation(id, status);

  const handleGrant = useCallback(() => {
    onGrant?.(id);
  }, [id, onGrant]);

  return (
    <View testID={testIds.enablePermissions.permissionCard(id)} style={styles.cardWrapper}>
      <View style={[permissionsStyles.card, styles.cardPending]} />
      <Animated.View style={[permissionsStyles.card, styles.cardGranted, grantedOverlayStyle]} />

      <View style={styles.cardContent}>
        <View style={permissionsStyles.cardRow}>
          <View style={styles.iconBoxWrapper}>
            <View style={[permissionsStyles.iconBox, styles.iconBoxPending]} />
            <Animated.View style={[permissionsStyles.iconBox, styles.iconBoxGranted, grantedOverlayStyle]} />
            <Animated.View style={[permissionsStyles.iconLayer, pendingIconStyle]}>
              <Icon stroke={colors.accent} />
            </Animated.View>
            <Animated.View style={[permissionsStyles.iconLayer, grantedIconStyle]}>
              <Icon stroke={colors.success} />
            </Animated.View>
          </View>

          <View style={permissionsStyles.cardContent}>
            <View style={permissionsStyles.cardTitleRow}>
              <Text style={permissionsStyles.cardTitle}>{title}</Text>
              <Animated.View
                testID={testIds.enablePermissions.grantedBadge(id)}
                style={[permissionsStyles.grantedBadge, badgeStyle]}
                pointerEvents={isGranted ? 'auto' : 'none'}
              >
                <CheckIcon />
              </Animated.View>
            </View>

            <Text style={permissionsStyles.cardDescription}>{description}</Text>

            {onGrant ? (
              <Activity mode={isGranted ? 'hidden' : 'visible'}>
                <Animated.View
                  style={[permissionsStyles.grantButtonContainer, grantButtonStyle]}
                  pointerEvents={isGranted ? 'none' : 'auto'}
                >
                  <Pressable
                    testID={testIds.enablePermissions.grantButton(id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Grant ${title}`}
                    disabled={isGranted}
                    style={permissionsStyles.grantButton}
                    onPress={handleGrant}
                  >
                    <Text style={permissionsStyles.grantButtonText}>Grant Permission</Text>
                  </Pressable>
                </Animated.View>
              </Activity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}, arePermissionCardPropsEqual);

PermissionCard.displayName = 'PermissionCard';

const styles = StyleSheet.create({
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
});
