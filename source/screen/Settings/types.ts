/** @format */

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import type { LegalDocumentId } from '@/screen/Legal';

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
};
