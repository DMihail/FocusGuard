/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import type { DashboardSectionId } from './sections';

import { DailyStatsRow, DistractingAppsSection, FocusOverviewCard, QuickActionsSection } from '../components';

export type DashboardSectionRenderContext = {
  summary: DashboardSummary;
  appRows: DashboardAppRow[];
  isMonitoring: boolean;
  hasSelectedApps: boolean;
  monitoringSubtitle: string;
  onConfigureLimits: (packageName: string) => void;
  onViewAllPress: () => void;
  onToggleMonitoring: () => void;
  onOpenManageApps: () => void;
};

export const createDashboardSectionRenderItem = (
  context: DashboardSectionRenderContext,
): ListRenderItem<DashboardSectionId> => {
  return ({ item }) => {
    switch (item) {
      case 'overview':
        return <FocusOverviewCard summary={context.summary} />;
      case 'stats':
        return <DailyStatsRow summary={context.summary} />;
      case 'apps':
        return (
          <DistractingAppsSection
            appRows={context.appRows}
            onConfigureLimits={context.onConfigureLimits}
            onViewAllPress={context.onViewAllPress}
          />
        );
      case 'actions':
        return (
          <QuickActionsSection
            isMonitoring={context.isMonitoring}
            canStartFocusMode={context.hasSelectedApps}
            monitoringSubtitle={context.monitoringSubtitle}
            onToggleMonitoring={context.onToggleMonitoring}
            onOpenManageApps={context.onOpenManageApps}
          />
        );
      default:
        return null;
    }
  };
};
