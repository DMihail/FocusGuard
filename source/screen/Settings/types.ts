/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import type { LegalDocumentId } from '@/domain/types/legal';

export type SettingsToggleItem = {
  title: string;
  description: string;
  Icon: ComponentType<SvgProps>;
  iconBackgroundColor: string;
  rowTestID?: string;
  toggleTestID?: string;
};

export type SettingsLinkItem = {
  id: LegalDocumentId;
  title: string;
  description: string;
  Icon: ComponentType<SvgProps>;
  iconBackgroundColor: string;
  iconStrokeColor: string;
};
