/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { BackIcon } from '@/assets/svg/ManageApps';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useRootNavigation } from '@/navigation';

import { legalSectionKeyExtractor, renderLegalSectionItem } from '../list';
import { legalStyles } from '../styles';
import type { LegalDocument } from '../types';

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
  const navigation = useRootNavigation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const listHeader = useMemo(
    () => (
      <>
        <View style={legalStyles.header} testID={headerTestId}>
          <Pressable
            testID={backButtonTestId}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={legalStyles.backButton}
            onPress={handleGoBack}
          >
            <BackIcon />
          </Pressable>

          <View style={legalStyles.headerText}>
            <Text style={legalStyles.title} accessibilityRole="header">
              {document.title}
            </Text>
            <Text style={legalStyles.subtitle}>{document.subtitle}</Text>
          </View>
        </View>

        <Text style={legalStyles.meta}>{`Last updated: ${document.lastUpdated}`}</Text>
      </>
    ),
    [backButtonTestId, document.lastUpdated, document.subtitle, document.title, handleGoBack, headerTestId],
  );

  return (
    <ScreenSafeArea style={legalStyles.screen} testID={screenTestId}>
      <FlatList
        testID={scrollTestId}
        data={document.sections}
        renderItem={renderLegalSectionItem}
        keyExtractor={legalSectionKeyExtractor}
        ListHeaderComponent={listHeader}
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
