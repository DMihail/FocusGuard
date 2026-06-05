/** @format */

import type { Identifiable, KeyExtractor, PackageIdentifiable, Titled } from './types';

export const keyById: KeyExtractor<Identifiable> = (item) => item.id;

export const keyByPackageName: KeyExtractor<PackageIdentifiable> = (item) => item.packageName;

/** Stable key for legal documents and other title-keyed lists. */
export const keyByTitle: KeyExtractor<Titled> = (item) => item.title;
