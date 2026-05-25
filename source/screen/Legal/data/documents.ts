/** @format */

import type { LegalDocument, LegalDocumentId } from '../types';
import { DATA_PRIVACY_DOCUMENT } from './dataPrivacy';
import { TERMS_PRIVACY_DOCUMENT } from './termsPrivacy';

export const LEGAL_DOCUMENTS: Record<LegalDocumentId, LegalDocument> = {
  dataPrivacy: DATA_PRIVACY_DOCUMENT,
  termsPrivacy: TERMS_PRIVACY_DOCUMENT,
};
