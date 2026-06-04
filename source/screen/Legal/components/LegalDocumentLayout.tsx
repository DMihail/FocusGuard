/** @format */

import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { BackIcon } from '@/assets/svg/ManageApps';
import { useRootNavigation } from '@/navigation';
import { APP_LIST_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';

import { legalStyles } from '../styles';
import type { LegalDocument, LegalSection } from '../types';

type LegalDocumentLayoutProps = {
  document: LegalDocument;
  screenTestId: string;
  scrollTestId: string;
  headerTestId: string;
  backButtonTestId: string;
};

const LegalSectionSeparator = () => <View style={legalStyles.sectionSeparator} />;

const LegalSectionBlock = ({ section }: { section: LegalSection }) => (
  <View style={legalStyles.section}>
    <Text style={legalStyles.sectionTitle} accessibilityRole="header">
      {section.title}
    </Text>
    {section.paragraphs.map((paragraph, index) => (
      <Text key={`${section.title}-${index}`} style={legalStyles.paragraph}>
        {paragraph}
      </Text>
    ))}
  </View>
);

export const LegalDocumentLayout = ({
  document,
  screenTestId,
  scrollTestId,
  headerTestId,
  backButtonTestId,
}: LegalDocumentLayoutProps) => {
  const navigation = useRootNavigation();

  const listHeader = (
    <>
      <View style={legalStyles.header} testID={headerTestId}>
        <Pressable
          testID={backButtonTestId}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={legalStyles.backButton}
          onPress={() => navigation.goBack()}
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
  );

  return (
    <SafeAreaView style={legalStyles.screen} edges={['top', 'bottom']} testID={screenTestId}>
      <FlatList
        testID={scrollTestId}
        data={document.sections}
        renderItem={({ item }) => <LegalSectionBlock section={item} />}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={listHeader}
        contentContainerStyle={legalStyles.scrollContent}
        ItemSeparatorComponent={LegalSectionSeparator}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={document.title}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </SafeAreaView>
  );
};
