/** @format */

export type ColorPalette = {
  background: string;
  surfaceDark: string;
  surface: string;
  accent: string;
  onSurface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  indicatorInactive: string;
  shadow: string;
  danger: string;
  success: string;
  warning: string;
  overLimit: string;
  overLimitMuted: string;
  primaryContainer: string;
  progressTrack: string;
  successMuted: string;
  successBorder: string;
  successIconBg: string;
  card: string;
  cardBorder: string;
  accentMuted: string;
  accentIconBg: string;
  privacyBackground: string;
  privacyBorder: string;
  buttonDisabled: string;
  appIconBackground: string;
  switchTrackOff: string;
  privacyHighlightBorder: string;
  privacyHighlightBg: string;
  privacyHighlightIconBg: string;
  divider: string;
};

export type ThemePreference = 'system' | 'light' | 'dark';

export type ResolvedColorScheme = 'light' | 'dark';

export type ThemePresets = {
  layoutPresets: {
    screen: { flex: number; backgroundColor: string };
    scrollContent: (gap?: number) => {
      flexGrow: number;
      paddingHorizontal: number;
      paddingBottom: number;
      gap: number;
    };
    rowBetween: {
      flexDirection: 'row';
      alignItems: 'center';
      justifyContent: 'space-between';
    };
    rowCenter: {
      flexDirection: 'row';
      alignItems: 'center';
    };
    card: {
      backgroundColor: string;
      borderWidth: number;
      borderColor: string;
      borderRadius: number;
    };
    cardLg: {
      backgroundColor: string;
      borderWidth: number;
      borderColor: string;
      borderRadius: number;
    };
    linkButton: {
      paddingVertical: number;
      paddingHorizontal: number;
    };
  };
  textPresets: Record<string, object>;
  iconBoxPresets: Record<string, object>;
  switchTrackColors: {
    false: string;
    true: string;
  };
};

export type Theme = {
  colors: ColorPalette;
  presets: ThemePresets;
  colorScheme: ResolvedColorScheme;
  isDark: boolean;
  preference: ThemePreference;
};
