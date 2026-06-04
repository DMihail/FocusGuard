/** @format */

import type { ListRenderItem } from 'react-native';

export type KeyExtractor<T> = (item: T, index: number) => string;

export type Identifiable = {
  id: string;
};

export type PackageIdentifiable = {
  packageName: string;
};

export type Titled = {
  title: string;
};

export type { ListRenderItem };
