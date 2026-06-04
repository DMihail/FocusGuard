/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { legalStyles } from '../styles';
import type { LegalSection } from '../types';

type LegalSectionBlockProps = {
  section: LegalSection;
};

function LegalSectionBlockView({ section }: LegalSectionBlockProps) {
  return (
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
}

export const LegalSectionBlock = memo(LegalSectionBlockView);
