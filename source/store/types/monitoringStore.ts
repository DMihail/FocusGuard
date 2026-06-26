/** @format */

export type MonitoringToggleFailureReason = 'permissions_missing' | 'service_start_failed';

export type MonitoringToggleResult =
  | { ok: true }
  | { ok: false; reason: MonitoringToggleFailureReason; detail?: string };

export type MonitoringStore = {
  isMonitoring: boolean;
  toggle: () => MonitoringToggleResult;
};
