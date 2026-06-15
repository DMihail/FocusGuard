import { getManageAppKey } from '@/domain/appKey';
import type { ManageApp } from '@/domain/types';

import type { Identifiable, KeyExtractor, PackageIdentifiable, Titled } from './types';

export const keyById: KeyExtractor<Identifiable> = (item) => item.id;

export const keyByPackageName: KeyExtractor<PackageIdentifiable> = (item) => item.packageName;

export const keyByManageApp = (item: ManageApp): string => getManageAppKey(item);

export const keyByTitle: KeyExtractor<Titled> = (item) => item.title;
