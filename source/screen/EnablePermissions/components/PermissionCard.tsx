/** @format */

import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
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
  const { t } = useTranslation();
  const { grantedOverlayStyle, pendingIconStyle, grantedIconStyle, badgeStyle, grantButtonStyle, isGranted } =
    usePermissionCardAnimation(id, status);

  const handleGrant = useCallback(() => {
    onGrant?.(id);
  }, [id, onGrant]);

  return (
    <View testID={testIds.enablePermissions.permissionCard(id)} style={styles.cardOverlayWrapper}>
      <View style={[styles.card, styles.cardOverlayPending]} />
      <Animated.View style={[styles.card, styles.cardOverlayGranted, grantedOverlayStyle]} />

      <View style={styles.cardOverlayPadding}>
        <View style={styles.cardRow}>
          <View style={styles.iconBoxWrapper}>
            <View style={[styles.iconBox, styles.iconBoxPending]} />
            <Animated.View style={[styles.iconBox, styles.iconBoxGranted, grantedOverlayStyle]} />
            <Animated.View style={[styles.iconLayer, pendingIconStyle]}>
              <Icon stroke={colors.accentOnContainer} />
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
                  accessibilityLabel={t('permissions.grantA11y', { title })}
                  disabled={isGranted}
                  style={styles.grantButton}
                  onPress={handleGrant}
                >
                  <Text style={styles.grantButtonText}>{t('common.grantPermission')}</Text>
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
