/** @format */

import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';

import { legalSectionKeyExtractor, renderLegalSectionItem } from '../list';
import { legalStyles } from '../styles';
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

const LegalSectionSeparator = () => <View style={legalStyles.sectionSeparator} />;

export const LegalDocumentLayout = ({
  document,
  screenTestId,
  scrollTestId,
  headerTestId,
  backButtonTestId,
}: LegalDocumentLayoutProps) => {
  const renderListHeader = useCallback(
    () => (
      <LegalDocumentListHeader document={document} headerTestId={headerTestId} backButtonTestId={backButtonTestId} />
    ),
    [backButtonTestId, document, headerTestId],
  );

  return (
    <ScreenSafeArea style={legalStyles.screen} testID={screenTestId}>
      <FlatList
        testID={scrollTestId}
        data={document.sections}
        renderItem={renderLegalSectionItem}
        keyExtractor={legalSectionKeyExtractor}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={legalStyles.scrollContent}
        ItemSeparatorComponent={LegalSectionSeparator}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={document.title}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
