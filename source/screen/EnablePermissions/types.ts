/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import type { PermissionId, PermissionStatus } from '@/domain/permissions';

export type PermissionIcon = ComponentType<SvgProps>;

export type PermissionItem = {
  id: PermissionId;
  title: string;
  description: string;
  status: PermissionStatus;
  Icon: PermissionIcon;
};
