/** @format */

import type { Identifiable, KeyExtractor, PackageIdentifiable, Titled } from './types';

export const keyById: KeyExtractor<Identifiable> = (item) => item.id;

export const keyByPackageName: KeyExtractor<PackageIdentifiable> = (item) => item.packageName;

export const keyByTitle: KeyExtractor<Titled> = (item) => item.title;
