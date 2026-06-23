import { getManageAppKey } from '@/domain/appKey';
import type { ManageApp } from '@/domain/types';

/** Shallow compare fields that affect Manage Apps list/chip UI. */
export const isSameManageAppForDisplay = (left: ManageApp, right: ManageApp): boolean =>
  getManageAppKey(left) === getManageAppKey(right) &&
  left.appName === right.appName &&
  left.appImage === right.appImage &&
  left.categoryLabel === right.categoryLabel;

export const areManageAppListsEqual = (left: ManageApp[], right: ManageApp[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftApp = left[index];
    const rightApp = right[index];

    if (!leftApp || !rightApp || !isSameManageAppForDisplay(leftApp, rightApp)) {
      return false;
    }
  }

  return true;
};
