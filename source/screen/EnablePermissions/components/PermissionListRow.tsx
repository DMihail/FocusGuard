/** @format */

import React, { memo } from 'react';

import type { PermissionId, PermissionItem } from '../types';
import { PermissionCard } from './PermissionCard';

type PermissionListRowProps = {
  item: PermissionItem;
  onGrant: (id: PermissionId) => void;
};

function PermissionListRowView({ item, onGrant }: PermissionListRowProps) {
  return <PermissionCard {...item} onGrant={() => onGrant(item.id)} />;
}

export const PermissionListRow = memo(PermissionListRowView, (previous, next) => {
  return previous.item.id === next.item.id && previous.onGrant === next.onGrant;
});
