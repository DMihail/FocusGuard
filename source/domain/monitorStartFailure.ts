/** @format */

import type { TranslateFn } from '@/i18n/types';
import type { MonitoringToggleResult } from '@/store/types/monitoringStore';

const SERVICE_REASON_MESSAGE_KEYS: Readonly<Record<string, string>> = {
  usage_access_missing: 'dashboard.monitorStartFailure.usageAccessMissing',
  overlay_access_missing: 'dashboard.monitorStartFailure.overlayAccessMissing',
  manifest_permissions_missing: 'dashboard.monitorStartFailure.manifestPermissionsMissing',
};

export const getMonitorStartFailureMessage = (
  t: TranslateFn,
  result: Extract<MonitoringToggleResult, { ok: false }>,
): { title: string; message: string } => {
  const title = t('dashboard.monitorStartFailure.title');

  if (result.reason === 'permissions_missing') {
    return {
      title,
      message: t('dashboard.monitorStartFailure.permissionsMissing'),
    };
  }

  const messageKey = result.detail ? SERVICE_REASON_MESSAGE_KEYS[result.detail] : undefined;

  return {
    title,
    message: messageKey ? t(messageKey) : t('dashboard.monitorStartFailure.generic'),
  };
};
