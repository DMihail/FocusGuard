/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useThemedStyles } from '@/hooks/useThemedStyles';

import { createLegalStyles } from '../styles';
import type { LegalDocument } from '../types';

import { ScreenBackHeader } from '@/components';

type LegalDocumentListHeaderProps = {
  document: LegalDocument;
  headerTestId: string;
  backButtonTestId: string;
};

export const LegalDocumentListHeader = ({ document, headerTestId, backButtonTestId }: LegalDocumentListHeaderProps) => {
  const styles = useThemedStyles(createLegalStyles);
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

      <Text style={styles.meta}>{`Last updated: ${document.lastUpdated}`}</Text>
    </>
  );
};
