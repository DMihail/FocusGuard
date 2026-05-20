/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export type PermissionStatus = 'granted' | 'pending';

export type PermissionIcon = ComponentType<SvgProps>;

export type PermissionItem = {
  id: string;
  title: string;
  description: string;
  status: PermissionStatus;
  Icon: PermissionIcon;
};
