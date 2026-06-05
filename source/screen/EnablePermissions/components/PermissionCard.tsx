/** @format */

import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { usePermissionCardAnimation } from '../hooks/usePermissionCardAnimation';
import { permissionsStyles } from '../styles';
import type { PermissionItem } from '../types';

type PermissionCardProps = PermissionItem & {
  onGrant?: () => void;
};

/** Animated permission card with grant action and granted-state transition. */
export const PermissionCard = memo(({ id, title, description, status, Icon, onGrant }: PermissionCardProps) => {
  const {
    grantedOverlayOpacity,
    pendingIconOpacity,
    grantedIconOpacity,
    badgeStyle,
    grantButtonOpacity,
    collapsed,
    isGranted,
  } = usePermissionCardAnimation(status);

  return (
    <View testID={testIds.enablePermissions.permissionCard(id)} style={styles.cardWrapper}>
      <View style={[permissionsStyles.card, styles.cardPending]} />
      <Animated.View style={[permissionsStyles.card, styles.cardGranted, { opacity: grantedOverlayOpacity }]} />

      <View style={styles.cardContent}>
        <View style={permissionsStyles.cardRow}>
          <View style={styles.iconBoxWrapper}>
            <View style={[permissionsStyles.iconBox, styles.iconBoxPending]} />
            <Animated.View
              style={[permissionsStyles.iconBox, styles.iconBoxGranted, { opacity: grantedOverlayOpacity }]}
            />
            <Animated.View style={[permissionsStyles.iconLayer, { opacity: pendingIconOpacity }]}>
              <Icon stroke={colors.accent} />
            </Animated.View>
            <Animated.View style={[permissionsStyles.iconLayer, { opacity: grantedIconOpacity }]}>
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

            {onGrant && !collapsed ? (
              <Animated.View
                style={[permissionsStyles.grantButtonContainer, { opacity: grantButtonOpacity }]}
                pointerEvents={isGranted ? 'none' : 'auto'}
              >
                <Pressable
                  testID={testIds.enablePermissions.grantButton(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Grant ${title}`}
                  disabled={isGranted}
                  style={permissionsStyles.grantButton}
                  onPress={onGrant}
                >
                  <Text style={permissionsStyles.grantButtonText}>Grant Permission</Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
});

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
