/** @format */

import { getMonitorStartFailureMessage } from '@/domain/monitorStartFailure';
import type { TranslateFn } from '@/i18n/types';

const t = ((key: string) => key) as TranslateFn;

describe('getMonitorStartFailureMessage', () => {
  it('maps missing permissions to the permissions message', () => {
    expect(getMonitorStartFailureMessage(t, { ok: false, reason: 'permissions_missing' })).toEqual({
      title: 'dashboard.monitorStartFailure.title',
      message: 'dashboard.monitorStartFailure.permissionsMissing',
    });
  });

  it('maps native start reasons to specific messages', () => {
    expect(
      getMonitorStartFailureMessage(t, {
        ok: false,
        reason: 'service_start_failed',
        detail: 'overlay_access_missing',
      }),
    ).toEqual({
      title: 'dashboard.monitorStartFailure.title',
      message: 'dashboard.monitorStartFailure.overlayAccessMissing',
    });
  });

  it('maps background start block to a specific message', () => {
    expect(
      getMonitorStartFailureMessage(t, {
        ok: false,
        reason: 'service_start_failed',
        detail: 'background_start_blocked',
      }),
    ).toEqual({
      title: 'dashboard.monitorStartFailure.title',
      message: 'dashboard.monitorStartFailure.backgroundStartBlocked',
    });
  });

  it('falls back to a generic message for unknown native reasons', () => {
    expect(
      getMonitorStartFailureMessage(t, {
        ok: false,
        reason: 'service_start_failed',
        detail: 'unexpected',
      }),
    ).toEqual({
      title: 'dashboard.monitorStartFailure.title',
      message: 'dashboard.monitorStartFailure.generic',
    });
  });
});
