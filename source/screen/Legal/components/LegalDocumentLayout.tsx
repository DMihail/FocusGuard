/** @format */

import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';

import { legalSectionKeyExtractor, renderLegalSectionItem } from '../list';
import { useLegalStyles } from '../styles';
import type { LegalDocument } from '../types';
import { LegalDocumentListHeader } from './LegalDocumentListHeader';

import { ScreenSafeArea } from '@/components';

type LegalDocumentLayoutProps = {
  document: LegalDocument;
  screenTestId: string;
  scrollTestId: string;
  headerTestId: string;
  backButtonTestId: string;
};

const LegalSectionSeparator = () => {
  const styles = useLegalStyles();

  return <View style={styles.sectionSeparator} />;
};

export const LegalDocumentLayout = ({
  document,
  screenTestId,
  scrollTestId,
  headerTestId,
  backButtonTestId,
}: LegalDocumentLayoutProps) => {
  const styles = useLegalStyles();

  const renderListHeader = useCallback(
    () => (
      <LegalDocumentListHeader document={document} headerTestId={headerTestId} backButtonTestId={backButtonTestId} />
    ),
    [backButtonTestId, document, headerTestId],
  );

  return (
    <ScreenSafeArea style={styles.screen} testID={screenTestId}>
      <FlatList
        testID={scrollTestId}
        data={document.sections}
        renderItem={renderLegalSectionItem}
        keyExtractor={legalSectionKeyExtractor}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.scrollContent}
        ItemSeparatorComponent={LegalSectionSeparator}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={document.title}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
