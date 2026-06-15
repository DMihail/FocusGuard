/** @format */

export type AppCategory = string;

/** Installed or selected app metadata shared across catalog, store, and usage views. */
export type ManageApp = {
  /** Android package name, e.g. `com.example.app`. */
  packageName: string;
  /** iOS Screen Time token id (`ios-token-0`, …). Omitted on Android. */
  tokenId?: string;
  appName: string;
  appImage: string;
  category: AppCategory;
  categoryLabel: string;
};
