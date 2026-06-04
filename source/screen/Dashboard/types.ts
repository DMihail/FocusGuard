/** @format */

import type { ManageApp } from '@/screen/ManageApps/types';

export type DistractingAppRowProps = Pick<ManageApp, 'packageName' | 'appName' | 'appImage'> & {
  onPress: (packageName: string) => void;
};
