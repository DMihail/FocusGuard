/** @format */

import React, { memo } from 'react';
import { Text } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';

import { legalStyles } from '../styles';
import type { LegalDocument } from '../types';

import { ScreenBackHeader } from '@/components';

type LegalDocumentListHeaderProps = {
  document: LegalDocument;
  headerTestId: string;
  backButtonTestId: string;
};

function LegalDocumentListHeaderView({ document, headerTestId, backButtonTestId }: LegalDocumentListHeaderProps) {
  const goBack = useGoBack();

  return (
    <>
      <ScreenBackHeader
        title={document.title}
        subtitle={document.subtitle}
        onBack={goBack}
        testID={headerTestId}
        backButtonTestID={backButtonTestId}
      />

      <Text style={legalStyles.meta}>{`Last updated: ${document.lastUpdated}`}</Text>
    </>
  );
}

export const LegalDocumentListHeader = memo(LegalDocumentListHeaderView, areLegalDocumentListHeaderPropsEqual);

function areLegalDocumentListHeaderPropsEqual(
  previous: LegalDocumentListHeaderProps,
  next: LegalDocumentListHeaderProps,
): boolean {
  return (
    previous.headerTestId === next.headerTestId &&
    previous.backButtonTestId === next.backButtonTestId &&
    previous.document.title === next.document.title &&
    previous.document.subtitle === next.document.subtitle &&
    previous.document.lastUpdated === next.document.lastUpdated
  );
}
