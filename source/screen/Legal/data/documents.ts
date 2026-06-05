/** @format */

import { getAppDisplayName } from '@/constants/appDisplayName';

import type { LegalDocument, LegalDocumentId } from '../types';
import { buildDataPrivacyDocument } from './dataPrivacy';
import { buildTermsPrivacyDocument } from './termsPrivacy';

export const getLegalDocument = (documentId: LegalDocumentId): LegalDocument => {
  const appDisplayName = getAppDisplayName();

  switch (documentId) {
    case 'dataPrivacy':
      return buildDataPrivacyDocument(appDisplayName);
    case 'termsPrivacy':
      return buildTermsPrivacyDocument(appDisplayName);
  }
};
