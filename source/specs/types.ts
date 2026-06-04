/** @format */

/** Per-app foreground usage statistics for the last 24 hours. */
export type AppUsageStat = Readonly<{
  /** Unique application identifier, e.g. `com.example.app`. */
  packageName: string;
  /** Human-readable application label. */
  appName: string;
  /** `file://` URI to the cached app icon, or empty string on failure. */
  appImage: string;
  /** Category name derived from `ApplicationInfo.category` (e.g. "Social", "Game"). */
  category: string;
  /** Time the app spent in the foreground during the query window, in milliseconds. */
  totalTimeForeground: number;
  /** Epoch timestamp (ms) of the app's last foreground session. */
  lastTimeUsed: number;
}>;

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
