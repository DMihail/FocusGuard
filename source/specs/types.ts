/** @format */

/** Emitted when Android permission state may have changed (e.g. returning from Settings). */
export type PermissionsChangedEvent = Readonly<{
  changedAtMs: number;
}>;

/** Daily foreground usage for a single tracked package. */
export type PackageUsage = Readonly<{
  packageName: string;
  usageMs: number;
}>;

/** Basic info about an installed launchable application. */
export type InstallApp = Readonly<{
  /** Unique application identifier, e.g. `com.example.app` on Android. */
  packageName: string;
  /** Opaque Screen Time token id on iOS (`ios-token-0`, …). */
  tokenId?: string;
  /** Human-readable application label. */
  appName: string;
  /** `file://` URI to the cached app icon, or empty string on failure. */
  appImage: string;
  /** Category name derived from `ApplicationInfo.category`. */
  category: string;
}>;

/** Codegen-safe result of attempting to start the monitor foreground service. */
export type MonitorServiceStartResult = {
  started: boolean;
  reason?: string;
};
