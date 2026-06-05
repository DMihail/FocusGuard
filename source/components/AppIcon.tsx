/** @format */

import React, { memo } from 'react';
import { Image, type ImageStyle, Text, type TextStyle, View, type ViewStyle } from 'react-native';

import { iconBoxPresets, textPresets } from '@/theme';

export type AppIconSize = keyof typeof iconBoxPresets;

export type AppIconProps = {
  appName: string;
  appImage?: string;
  size?: AppIconSize;
  boxStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  fallbackStyle?: TextStyle;
};

const imageSizeByPreset: Record<AppIconSize, ImageStyle> = {
  sm: { width: 40, height: 40 },
  md: { width: 48, height: 48 },
  lg: { width: 52, height: 52 },
};

const getAppNameInitial = (appName: string): string => appName.charAt(0).toUpperCase();

function AppIconView({ appName, appImage, size = 'md', boxStyle, imageStyle, fallbackStyle }: AppIconProps) {
  return (
    <View style={[iconBoxPresets[size], boxStyle]}>
      {appImage ? (
        <Image source={{ uri: appImage }} style={[imageSizeByPreset[size], imageStyle]} resizeMode="cover" />
      ) : (
        <Text style={[textPresets.iconFallbackLg, fallbackStyle]}>{getAppNameInitial(appName)}</Text>
      )}
    </View>
  );
}

export const AppIcon = memo(AppIconView, areAppIconPropsEqual);

function areAppIconPropsEqual(previous: AppIconProps, next: AppIconProps): boolean {
  return (
    previous.appName === next.appName &&
    previous.appImage === next.appImage &&
    previous.size === next.size &&
    previous.boxStyle === next.boxStyle &&
    previous.imageStyle === next.imageStyle &&
    previous.fallbackStyle === next.fallbackStyle
  );
}

AppIcon.displayName = 'AppIcon';
