import Foundation

enum KeeptMonitoringStateStore {
  static var isEnabled: Bool {
    KeeptAppGroup.defaults?.bool(forKey: KeeptAppGroup.StorageKey.monitoringEnabled) ?? false
  }

  static func setEnabled(_ enabled: Bool) {
    KeeptAppGroup.defaults?.set(enabled, forKey: KeeptAppGroup.StorageKey.monitoringEnabled)
  }
}
