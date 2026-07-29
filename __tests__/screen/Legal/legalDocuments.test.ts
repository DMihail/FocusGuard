/** @format */

import { SUPPORT_EMAIL } from '@/constants/branding';
import { buildDataPrivacyDocument } from '@/screen/Legal/data/dataPrivacy';
import { buildTermsPrivacyDocument } from '@/screen/Legal/data/termsPrivacy';

const APP = 'Keept';

describe('legal document builders', () => {
  it('builds data privacy for each language × platform with stable section counts', () => {
    const androidEn = buildDataPrivacyDocument({
      appDisplayName: APP,
      language: 'en',
      platform: 'android',
    });
    const androidRu = buildDataPrivacyDocument({
      appDisplayName: APP,
      language: 'ru',
      platform: 'android',
    });
    const iosEn = buildDataPrivacyDocument({
      appDisplayName: APP,
      language: 'en',
      platform: 'ios',
    });
    const iosRu = buildDataPrivacyDocument({
      appDisplayName: APP,
      language: 'ru',
      platform: 'ios',
    });

    expect(androidEn.title).toBe('Data Privacy');
    expect(androidRu.title).toBe('Конфиденциальность данных');
    expect(androidEn.lastUpdated).toBe('July 15, 2026');
    expect(iosEn.lastUpdated).toBe('May 19, 2026');
    expect(androidEn.sections).toHaveLength(9);
    expect(iosEn.sections).toHaveLength(9);
    expect(androidRu.sections).toHaveLength(9);
    expect(iosRu.sections).toHaveLength(9);

    expect(androidEn.sections[3]?.title).toBe('Android permissions we use');
    expect(iosEn.sections[3]?.title).toBe('iOS permissions we use');
    expect(androidEn.sections[1]?.paragraphs.join('\n')).toContain('Usage Access');
    expect(iosEn.sections[1]?.paragraphs.join('\n')).toContain('Screen Time');
    expect(androidEn.sections[4]?.paragraphs[1]).toContain('opt out');
    expect(androidRu.sections[4]?.paragraphs[1]).toBe('В debug-сборках отчёты о сбоях отключены.');
    expect(iosEn.sections[4]?.paragraphs[1]).toBe('Crash reporting is disabled in debug builds.');
  });

  it('builds terms with platform-specific disclaimer and shared contact', () => {
    const androidEn = buildTermsPrivacyDocument({
      appDisplayName: APP,
      language: 'en',
      platform: 'android',
    });
    const iosRu = buildTermsPrivacyDocument({
      appDisplayName: APP,
      language: 'ru',
      platform: 'ios',
    });

    expect(androidEn.title).toBe('Terms & Privacy');
    expect(iosRu.title).toBe('Условия и конфиденциальность');
    expect(androidEn.sections).toHaveLength(9);
    expect(iosRu.sections).toHaveLength(9);

    const androidDisclaimer = androidEn.sections[5]?.paragraphs.join('\n') ?? '';
    const iosDisclaimer = iosRu.sections[5]?.paragraphs.join('\n') ?? '';
    expect(androidDisclaimer).toContain('Picture-in-picture');
    expect(iosDisclaimer).toContain('Split View');
    expect(androidEn.sections[8]?.paragraphs[0]).toContain(SUPPORT_EMAIL);
    expect(iosRu.sections[8]?.paragraphs[0]).toContain(SUPPORT_EMAIL);
  });
});
