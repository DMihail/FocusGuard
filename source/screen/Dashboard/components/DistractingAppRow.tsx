/** @format */

import React from 'react';
import { Image, Text, View } from 'react-native';
import { AppUsageStat } from '../../../specs';
import { dashboardStyles } from '../styles';

type DistractingAppRowProps = AppUsageStat;

export const DistractingAppRow = ({ appImage, appName }: DistractingAppRowProps) => (
  <View style={dashboardStyles.appItem}>
    <View style={dashboardStyles.appRow}>
      <View style={dashboardStyles.appIconBox}>
        {appImage ? (
          <Image source={{ uri: appImage }} style={dashboardStyles.appIcon} resizeMode="cover" />
        ) : (
          <Text style={dashboardStyles.appIconFallback}>{appName.charAt(0).toUpperCase()}</Text>
        )}
      </View>

      <View style={dashboardStyles.appInfo}>
        <Text style={dashboardStyles.appName} numberOfLines={1}>
          {appName}
        </Text>
      </View>
    </View>
  </View>
);
