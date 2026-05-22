/** @format */

import React from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { testIds } from '@/testing/testIds';
import { LegalDocumentLayout } from './components/LegalDocumentLayout';
import { LEGAL_DOCUMENTS } from './data/documents';

type LegalDocumentRoute = RouteProp<RootStackParamList, 'LegalDocument'>;

export const LegalDocumentScreen = () => {
  const { documentId } = useRoute<LegalDocumentRoute>().params;
  const document = LEGAL_DOCUMENTS[documentId];
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
