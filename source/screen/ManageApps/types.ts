/** @format */

export type AppCategory = string;

export type CategoryFilterOption = {
  id: string;
  label: string;
  category: AppCategory | 'all';
};

export type ManageApp = {
  packageName: string;
  appName: string;
  appImage: string;
  category: AppCategory;
  categoryLabel: string;
};

export type SelectedAppsSectionProps = {
  apps: ManageApp[];
  onAppPress: (packageName: string) => void;
  onAppRemove: (app: ManageApp) => void;
};

export type ManageAppsListHeaderProps = {
  selectedApps: ManageApp[];
  onSelectedAppPress: (packageName: string) => void;
  onSelectedAppRemove: (app: ManageApp) => void;
  isSearchActive: boolean;
  categoryFilters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export type ManageAppsContentProps = ManageAppsListHeaderProps & {
  apps: ManageApp[];
  isLoadingApps: boolean;
  isFiltering: boolean;
  isSelected: (packageName: string) => boolean;
  onToggle: (app: ManageApp) => void;
};
