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
};
