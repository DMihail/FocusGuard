/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';

import type { PermissionId, PermissionItem } from '../types';

import { PermissionListRow } from '../components/PermissionListRow';

export const createPermissionListRenderItem = (onGrant: (id: PermissionId) => void): ListRenderItem<PermissionItem> => {
  return ({ item }) => <PermissionListRow item={item} onGrant={onGrant} />;
};
