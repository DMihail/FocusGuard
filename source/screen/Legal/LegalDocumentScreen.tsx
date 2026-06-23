/** @format */

import React from 'react';

import { type RouteProp, useRoute } from '@react-navigation/native';

import { useTranslation } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { testIds } from '@/testing/testIds';

import { getLegalDocument } from './data/documents';

import { LegalDocumentLayout } from './components/LegalDocumentLayout';

type LegalDocumentRoute = RouteProp<RootStackParamList, 'LegalDocument'>;

export const LegalDocumentScreen = () => {
  const { documentId } = useRoute<LegalDocumentRoute>().params;
  const { language } = useTranslation();
  const document = getLegalDocument(documentId, language);
  const ids = testIds.legal[documentId];

  return (
    <LegalDocumentLayout
      document={document}
      screenTestId={ids.screen}
      scrollTestId={ids.scroll}
      headerTestId={ids.header}
      backButtonTestId={ids.backButton}
    />
  );
};
