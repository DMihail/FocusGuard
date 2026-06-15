/** @format */

export type { LegalDocumentId } from '@/domain/types/legal';

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
