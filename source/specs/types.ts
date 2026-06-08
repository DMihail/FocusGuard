/** @format */

/** Basic info about an installed launchable application. */
export type InstallApp = Readonly<{
  /** Unique application identifier, e.g. `com.example.app`. */
  packageName: string;
  /** Human-readable application label. */
  appName: string;
  /** `file://` URI to the cached app icon, or empty string on failure. */
  appImage: string;
  /** Category name derived from `ApplicationInfo.category`. */
  category: string;
}>;
