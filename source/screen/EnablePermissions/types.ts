/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export type PermissionStatus = 'granted' | 'pending';

export type PermissionId = 'usage-access' | 'display-over-apps' | 'notifications';

export type PermissionIcon = ComponentType<SvgProps>;

export type PermissionItem = {
  id: PermissionId;
  title: string;
  description: string;
  status: PermissionStatus;
  Icon: PermissionIcon;
};
