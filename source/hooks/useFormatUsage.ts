/** @format */

import { useCallback, useMemo } from 'react';

import { useTranslation } from '@/i18n';
import { createDurationFormatter } from '@/i18n/format';
import { MS_PER_MINUTE } from '@/utils/usage/constants';

export const useFormatUsage = () => {
  const { t } = useTranslation();
  const formatDurationMinutes = useMemo(() => createDurationFormatter(t), [t]);

  const formatUsageMinutes = useCallback(
    (ms: number) => formatDurationMinutes(ms / MS_PER_MINUTE),
    [formatDurationMinutes],
  );

  const formatUsagePair = useCallback(
    (usedMs: number, limitMs: number) =>
      t('format.usagePair', {
        used: formatUsageMinutes(usedMs),
        limit: formatUsageMinutes(limitMs),
      }),
    [formatUsageMinutes, t],
  );

  return {
    formatDurationMinutes,
    formatUsageMinutes,
    formatUsagePair,
  };
};
