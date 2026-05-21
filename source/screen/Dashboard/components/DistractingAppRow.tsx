/** @format */

import React from 'react';
import { Image, Text, View } from 'react-native';
import type { ManageApp } from '@/screen/ManageApps/types';
import { testIds } from '@/testing/testIds';
import { dashboardStyles } from '../styles';

type DistractingAppRowProps = Pick<ManageApp, 'packageName' | 'appName' | 'appImage'>;

export const DistractingAppRow = ({ packageName, appImage, appName }: DistractingAppRowProps) => (
  <View style={dashboardStyles.appItem} testID={testIds.dashboard.appRow(packageName)}>
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
