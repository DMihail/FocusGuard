/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';

import type { PermissionId, PermissionItem } from '../types';

import { PermissionCard } from '../components/PermissionCard';

export const createPermissionListRenderItem = (onGrant: (id: PermissionId) => void): ListRenderItem<PermissionItem> => {
  return ({ item }) => <PermissionCard {...item} onGrant={onGrant} />;
};
