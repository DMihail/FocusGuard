import Foundation

/// App Group + storage keys shared with JS (`source/store/persistSchema.ts`).
enum KeeptAppGroup {
  static let identifier = "group.com.keept.shared"

  enum StorageKey {
    static let iosTrackingSnapshot = "ios-tracking-snapshot-v2"
    static let familyActivitySelection = "ios-family-activity-selection-v1"
    static let monitoringEnabled = "ios-monitoring-enabled-v1"
    static let blockSnoozePrefix = "ios-block-snooze-"
    static let dailyWarningPrefix = "ios-daily-warning-"
    static let iosDailyUsage = "ios-daily-usage-v1"
  }

  /// Screen Time authorization mode for Keept — self-control only.
  static let screenTimeAuthMode = "individual"

  static var defaults: UserDefaults? {
    UserDefaults(suiteName: identifier)
  }
}
