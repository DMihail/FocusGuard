import Foundation

enum IosTrackingSnoozeStore {
  private static let snoozeDurationMs: Int64 = 5 * 60 * 1_000

  static func setSnooze(tokenId: String) {
    let untilMs = Int64(Date().timeIntervalSince1970 * 1_000) + snoozeDurationMs
    KeeptAppGroup.defaults?.set(untilMs, forKey: storageKey(for: tokenId))
  }

  static func isSnoozed(tokenId: String) -> Bool {
    let untilMs = KeeptAppGroup.defaults?.object(forKey: storageKey(for: tokenId)) as? Int64 ?? 0
    let nowMs = Int64(Date().timeIntervalSince1970 * 1_000)

    if untilMs <= nowMs {
      clearSnooze(tokenId: tokenId)
      return false
    }

    return true
  }

  static func clearSnooze(tokenId: String) {
    KeeptAppGroup.defaults?.removeObject(forKey: storageKey(for: tokenId))
  }

  private static func storageKey(for tokenId: String) -> String {
    "\(KeeptAppGroup.StorageKey.blockSnoozePrefix)\(tokenId)"
  }
}
