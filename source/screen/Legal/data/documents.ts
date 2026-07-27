/** @format */

import { Platform } from 'react-native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import type { LegalDocumentId } from '@/domain/types/legal';
import type { AppLanguage } from '@/i18n';

import type { LegalDocument } from '../types';
import { buildDataPrivacyDocument } from './dataPrivacy';
import type { LegalPlatform } from './localize';
import { buildTermsPrivacyDocument } from './termsPrivacy';

const resolveLegalPlatform = (): LegalPlatform => (Platform.OS === 'ios' ? 'ios' : 'android');

export const getLegalDocument = (documentId: LegalDocumentId, language: AppLanguage): LegalDocument => {
  const ctx = {
    appDisplayName: getAppDisplayName(),
    language,
    platform: resolveLegalPlatform(),
  };

  switch (documentId) {
    case 'dataPrivacy':
      return buildDataPrivacyDocument(ctx);
    case 'termsPrivacy':
      return buildTermsPrivacyDocument(ctx);
  }
};
