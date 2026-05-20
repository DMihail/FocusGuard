/** @format */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { testIds } from '../../../testing/testIds';
import { permissionsStyles } from '../styles';

type PermissionsFooterProps = {
  canContinue: boolean;
  onContinue: () => void;
};

export const PermissionsFooter = ({ canContinue, onContinue }: PermissionsFooterProps) => (
  <Pressable
    testID={testIds.enablePermissions.continueButton}
    accessibilityRole="button"
    accessibilityLabel="Continue"
    accessibilityState={{ disabled: !canContinue }}
    disabled={!canContinue}
    style={[permissionsStyles.continueButton, canContinue && permissionsStyles.continueButtonEnabled]}
    onPress={onContinue}
  >
    <Text style={[permissionsStyles.continueText, canContinue && permissionsStyles.continueTextEnabled]}>Continue</Text>
  </Pressable>
);
