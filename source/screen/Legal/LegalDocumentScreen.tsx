/** @format */

import React from 'react';

import { type RouteProp, useRoute } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/types';
import { testIds } from '@/testing/testIds';

import { LEGAL_DOCUMENTS } from './data/documents';

import { LegalDocumentLayout } from './components/LegalDocumentLayout';

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
