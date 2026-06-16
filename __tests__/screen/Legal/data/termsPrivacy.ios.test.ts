/** @format */

import { buildTermsPrivacyDocument } from '@/screen/Legal/data/termsPrivacy.ios';

describe('termsPrivacy.ios', () => {
  const document = buildTermsPrivacyDocument('Keept');

  it('references iOS and Screen Time instead of Android overlays', () => {
    const features = document.sections.find((section) => section.title === 'What Keept provides');
    const permissions = document.sections.find((section) => section.title === 'Permissions and your responsibility');

    expect(features?.paragraphs.join(' ')).toMatch(/iOS/i);
    expect(permissions?.paragraphs.join(' ')).toMatch(/Screen Time/i);
    expect(permissions?.paragraphs.join(' ')).not.toMatch(/Android permissions/i);
  });
});
