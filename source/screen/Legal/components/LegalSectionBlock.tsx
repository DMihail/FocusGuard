/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';

import { createLegalStyles } from '../styles';
import type { LegalSection } from '../types';

type LegalSectionBlockProps = {
  section: LegalSection;
};

export const LegalSectionBlock = memo(({ section }: LegalSectionBlockProps) => {
  const styles = useThemedStyles(createLegalStyles);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {section.title}
      </Text>
      {section.paragraphs.map((paragraph, index) => (
        <Text key={`${section.title}-${index}`} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </View>
  );
});
