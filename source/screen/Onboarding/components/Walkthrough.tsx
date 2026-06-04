/** @format */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { FC } from 'react';

import { borderRadius, colors, spacing, typography } from '@/theme';

type WalkthroughProps = {
  title: string;
  text: string;
  icon: React.ReactNode;
};

export const Walkthrough: FC<WalkthroughProps> = ({ title, text, icon }) => {
  return (
    <View style={styles.content}>
      <View style={styles.iconContainer}>{icon}</View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 224,
    height: 224,
    borderRadius: borderRadius.walkthrough,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 350,
  },
});
