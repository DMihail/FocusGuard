/** @format */

import type { PermissionId } from '../screen/EnablePermissions/types';

const toSegment = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, '-');

export const testIds = {
  app: {
    loader: 'app-loader',
  },
  onboarding: {
    screen: 'onboarding-screen',
    skipButton: 'onboarding-skip-button',
    continueButton: 'onboarding-continue-button',
    walkthroughPager: 'onboarding-walkthrough-pager',
    walkthroughStep: (stepId: string) => `onboarding-step-${toSegment(stepId)}`,
  },
  enablePermissions: {
    screen: 'enable-permissions-screen',
    scroll: 'enable-permissions-scroll',
    header: 'enable-permissions-header',
    cards: 'enable-permissions-cards',
    privacyNotice: 'enable-permissions-privacy-notice',
    continueButton: 'enable-permissions-continue-button',
    permissionCard: (id: PermissionId) => `permission-card-${id}`,
    grantButton: (id: PermissionId) => `grant-permission-${id}`,
    grantedBadge: (id: PermissionId) => `permission-granted-badge-${id}`,
  },
  dashboard: {
    screen: 'dashboard-screen',
    scroll: 'dashboard-scroll',
    header: 'dashboard-header',
    greeting: 'dashboard-greeting',
    settingsButton: 'dashboard-settings-button',
    distractingAppsSection: 'dashboard-distracting-apps-section',
    viewAllAppsButton: 'dashboard-view-all-apps-button',
    appsList: 'dashboard-apps-list',
    appsEmpty: 'dashboard-apps-empty',
    appRow: (packageName: string) => `dashboard-app-row-${toSegment(packageName)}`,
  },
  manageApps: {
    screen: 'manage-apps-screen',
    scroll: 'manage-apps-scroll',
    header: 'manage-apps-header',
    backButton: 'manage-apps-back-button',
    selectedCount: 'manage-apps-selected-count',
    searchField: 'manage-apps-search-field',
    searchInput: 'manage-apps-search-input',
    categoryFilters: 'manage-apps-category-filters',
    categoryFilter: (category: string) => `manage-apps-category-${toSegment(category)}`,
    selectedSection: 'manage-apps-selected-section',
    selectedAppsScroll: 'manage-apps-selected-apps-scroll',
    selectedChip: (packageName: string) => `manage-apps-selected-chip-${toSegment(packageName)}`,
    appsList: 'manage-apps-list',
    appsEmpty: 'manage-apps-empty',
    appRow: (packageName: string) => `manage-apps-row-${toSegment(packageName)}`,
    appSelectionControl: (packageName: string) => `manage-apps-selection-${toSegment(packageName)}`,
  },
} as const;
