/** @format */

import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

export type DistractingAppRowProps = DashboardAppRow & {
  onPress: (packageName: string) => void;
};
