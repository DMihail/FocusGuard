/** @format */

import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export const onboardingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    minHeight: 36,
    paddingHorizontal: 24,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  skipText: {
    ...typography.button,
    color: colors.accent,
  },
  pagerContainer: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  footer: {
    paddingBottom: 8,
    paddingHorizontal: 24,
    gap: 16,
  },
  continueButton: {
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  continueText: {
    ...typography.button,
    color: colors.onSurface,
  },
});
