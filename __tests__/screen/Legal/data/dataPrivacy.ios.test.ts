/** @format */

import { buildDataPrivacyDocument } from '@/screen/Legal/data/dataPrivacy.ios';

describe('dataPrivacy.ios', () => {
  const document = buildDataPrivacyDocument('Keept');

  it('describes Screen Time data collection', () => {
    const permissionsSection = document.sections.find((section) => section.title === 'iOS permissions we use');

    expect(permissionsSection?.paragraphs.join(' ')).toMatch(/Screen Time/i);
    expect(permissionsSection?.paragraphs.join(' ')).not.toMatch(/Usage Access/i);
  });
});
