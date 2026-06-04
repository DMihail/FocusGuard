/** @format */

import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { BackIcon } from '@/assets/svg/ManageApps';
import { useRootNavigation } from '@/navigation';

import { legalStyles } from '../styles';
import type { LegalDocument } from '../types';

type LegalDocumentLayoutProps = {
  document: LegalDocument;
  screenTestId: string;
  scrollTestId: string;
  headerTestId: string;
  backButtonTestId: string;
};

export const LegalDocumentLayout = ({
  document,
  screenTestId,
  scrollTestId,
  headerTestId,
  backButtonTestId,
}: LegalDocumentLayoutProps) => {
  const navigation = useRootNavigation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={legalStyles.screen} edges={['top', 'bottom']} testID={screenTestId}>
      <ScrollView
        testID={scrollTestId}
        contentContainerStyle={legalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={legalStyles.header} testID={headerTestId}>
          <Pressable
            testID={backButtonTestId}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={legalStyles.backButton}
            onPress={handleBack}
          >
            <BackIcon />
          </Pressable>

          <View style={legalStyles.headerText}>
            <Text style={legalStyles.title}>{document.title}</Text>
            <Text style={legalStyles.subtitle}>{document.subtitle}</Text>
          </View>
        </View>

        <Text style={legalStyles.meta}>{`Last updated: ${document.lastUpdated}`}</Text>

        <View style={legalStyles.sections}>
          {document.sections.map((section) => (
            <View key={section.title} style={legalStyles.section}>
              <Text style={legalStyles.sectionTitle}>{section.title}</Text>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={`${section.title}-${index}`} style={legalStyles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
