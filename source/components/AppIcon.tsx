/** @format */

import React, { memo, useMemo } from 'react';
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

const areAppIconPropsEqual = (previous: AppIconProps, next: AppIconProps): boolean =>
  previous.appName === next.appName &&
  previous.appImage === next.appImage &&
  previous.size === next.size &&
  previous.boxStyle === next.boxStyle &&
  previous.imageStyle === next.imageStyle &&
  previous.fallbackStyle === next.fallbackStyle;

export const AppIcon = memo(({ appName, appImage, size = 'md', boxStyle, imageStyle, fallbackStyle }: AppIconProps) => {
  const imageSource = useMemo(() => (appImage ? { uri: appImage } : null), [appImage]);

  return (
    <View style={[iconBoxPresets[size], boxStyle]}>
      {imageSource ? (
        <Image source={imageSource} style={[imageSizeByPreset[size], imageStyle]} resizeMode="cover" />
      ) : (
        <Text style={[textPresets.iconFallbackLg, fallbackStyle]}>{getAppNameInitial(appName)}</Text>
      )}
    </View>
  );
}, areAppIconPropsEqual);
