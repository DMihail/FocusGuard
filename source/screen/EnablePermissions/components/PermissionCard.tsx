/** @format */

import React from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { CheckIcon } from '../../../assets/svg/EnablePermissions';
import { colors } from '../../../theme';
import { usePermissionCardAnimation } from '../hooks/usePermissionCardAnimation';
import { testIds } from '../../../testing/testIds';
import type { PermissionItem } from '../types';
import { permissionsStyles } from '../styles';

type PermissionCardProps = PermissionItem & {
  onGrant?: () => void;
};

export const PermissionCard = ({ id, title, description, status, Icon, onGrant }: PermissionCardProps) => {
  const { cardStyle, iconBoxStyle, pendingIconOpacity, grantedIconOpacity, badgeStyle, grantButtonStyle, isGranted } =
    usePermissionCardAnimation(status);

  return (
    <Animated.View style={[permissionsStyles.card, cardStyle]} testID={testIds.enablePermissions.permissionCard(id)}>
      <View style={permissionsStyles.cardRow}>
        <Animated.View style={[permissionsStyles.iconBox, iconBoxStyle]}>
          <Animated.View style={[permissionsStyles.iconLayer, { opacity: pendingIconOpacity }]}>
            <Icon stroke={colors.accent} />
          </Animated.View>
          <Animated.View style={[permissionsStyles.iconLayer, { opacity: grantedIconOpacity }]}>
            <Icon stroke={colors.success} />
          </Animated.View>
        </Animated.View>

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
                onPress={onGrant}
              >
                <Text style={permissionsStyles.grantButtonText}>Grant Permission</Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};
