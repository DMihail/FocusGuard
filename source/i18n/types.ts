/** @format */

import type { TFunction } from 'i18next';

export type AppLanguage = 'en' | 'ru';

export type LanguagePreference = 'system' | AppLanguage;

export type TranslationLeaf = string;

export type TranslationTree = {
  readonly [key: string]: TranslationLeaf | TranslationTree;
};

export type TranslateFn = TFunction;
