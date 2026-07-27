/** @format */

import type { AppLanguage } from '@/i18n';

import type { LegalDocument } from '../types';

export type LegalPlatform = 'android' | 'ios';

export type LegalBuildContext = {
  appDisplayName: string;
  language: AppLanguage;
  platform: LegalPlatform;
};

/** Pick EN/RU copy without changing legal wording. */
export const legalText = (language: AppLanguage, en: string, ru: string): string => (language === 'ru' ? ru : en);

export type LegalDocumentBuilder = (ctx: LegalBuildContext) => LegalDocument;
