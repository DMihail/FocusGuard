/** @format */

import React, { memo } from 'react';

import type { PermissionId, PermissionItem } from '../types';
import { PermissionCard } from './PermissionCard';

type PermissionListRowProps = {
  item: PermissionItem;
  onGrant: (id: PermissionId) => void;
};

export const PermissionListRow = memo(({ item, onGrant }: PermissionListRowProps) => {
  return <PermissionCard {...item} onGrant={onGrant} />;
}, arePermissionListRowPropsEqual);

function arePermissionListRowPropsEqual(previous: PermissionListRowProps, next: PermissionListRowProps): boolean {
  return (
    previous.item.id === next.item.id && previous.item.status === next.item.status && previous.onGrant === next.onGrant
  );
}
