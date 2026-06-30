/** @format */

import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { useScrollContentContainerStyle } from '@/hooks/useScrollContentContainerStyle';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { keyByTitle as legalSectionKeyExtractor } from '@/list/keys';

import { renderLegalSectionItem } from '../list/renderers';
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
  const { scrollContentContainerStyle } = useScrollContentContainerStyle(styles.scrollContent);

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
        contentContainerStyle={scrollContentContainerStyle}
        ItemSeparatorComponent={LegalSectionSeparator}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={document.title}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
