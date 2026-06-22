/** @format */

import React from 'react';
import { Pressable, Text } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createPermissionsStyles } from '../styles';

type PermissionsFooterProps = {
  canContinue: boolean;
  onContinue: () => void;
};

export const PermissionsFooter = ({ canContinue, onContinue }: PermissionsFooterProps) => {
  const styles = useThemedStyles(createPermissionsStyles);

  return (
    <Pressable
      testID={testIds.enablePermissions.continueButton}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      accessibilityState={{ disabled: !canContinue }}
      disabled={!canContinue}
      style={[styles.continueButton, canContinue && styles.continueButtonEnabled]}
      onPress={onContinue}
    >
      <Text style={[styles.continueText, canContinue && styles.continueTextEnabled]}>Continue</Text>
    </Pressable>
  );
};
