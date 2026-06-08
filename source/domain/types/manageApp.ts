/** @format */

export type AppCategory = string;

/** Installed or selected app metadata shared across catalog, store, and usage views. */
export type ManageApp = {
  packageName: string;
  appName: string;
  appImage: string;
  category: AppCategory;
  categoryLabel: string;
};
