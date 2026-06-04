/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';

import type { LegalSection } from '../types';

import { LegalSectionBlock } from '../components/LegalSectionBlock';

export const renderLegalSectionItem: ListRenderItem<LegalSection> = ({ item }) => <LegalSectionBlock section={item} />;
