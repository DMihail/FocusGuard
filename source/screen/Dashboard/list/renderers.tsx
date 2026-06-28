/** @format */

import React from 'react';

import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import type { DashboardSectionId } from './sections';

import { DailyStatsRow } from '../components/DailyStatsRow';
import { DistractingAppsSection } from '../components/DistractingAppsSection';
import { FocusOverviewCard } from '../components/FocusOverviewCard';
import { QuickActionsSection } from '../components/QuickActionsSection';

export type DashboardSectionRenderContext = {
  summary: DashboardSummary;
  appRows: DashboardAppRow[];
  isMonitoring: boolean;
  hasSelectedApps: boolean;
  monitoringSubtitle: string;
  onConfigureLimits: (appKey: string) => void;
  onViewAllPress: () => void;
  onOpenStatistics: () => void;
  onToggleMonitoring: () => void;
  onOpenManageApps: () => void;
};

export const renderDashboardSection = (
  sectionId: DashboardSectionId,
  context: DashboardSectionRenderContext,
): React.ReactElement | null => {
  switch (sectionId) {
    case 'overview':
      return <FocusOverviewCard summary={context.summary} onPress={context.onOpenStatistics} />;
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
