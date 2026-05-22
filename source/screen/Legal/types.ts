/** @format */

export type LegalDocumentId = 'dataPrivacy' | 'termsPrivacy';

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
};
