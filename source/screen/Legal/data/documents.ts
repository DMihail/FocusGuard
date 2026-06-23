/** @format */

import { getAppDisplayName } from '@/constants/appDisplayName';
import type { AppLanguage } from '@/i18n';
import { buildDataPrivacyDocument as buildRuDataPrivacyDocument } from '@/i18n/legal/ru/dataPrivacy';
import { buildTermsPrivacyDocument as buildRuTermsPrivacyDocument } from '@/i18n/legal/ru/termsPrivacy';

import type { LegalDocument, LegalDocumentId } from '../types';
import { buildDataPrivacyDocument } from './dataPrivacy';
import { buildTermsPrivacyDocument } from './termsPrivacy';

export const getLegalDocument = (documentId: LegalDocumentId, language: AppLanguage): LegalDocument => {
  const appDisplayName = getAppDisplayName();

  if (language === 'ru') {
    switch (documentId) {
      case 'dataPrivacy':
        return buildRuDataPrivacyDocument(appDisplayName);
      case 'termsPrivacy':
        return buildRuTermsPrivacyDocument(appDisplayName);
    }
  }

  switch (documentId) {
    case 'dataPrivacy':
      return buildDataPrivacyDocument(appDisplayName);
    case 'termsPrivacy':
      return buildTermsPrivacyDocument(appDisplayName);
  }
};
