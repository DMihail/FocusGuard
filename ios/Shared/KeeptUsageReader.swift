import Foundation

enum KeeptUsageReader {
  static func buildPayload(packageNames: [String]) -> [[String: Any]] {
    IosDailyUsageStore.resetForNewDayIfNeeded()

    return packageNames.map { tokenId in
      [
        "packageName": tokenId,
        "usageMs": NSNumber(value: IosDailyUsageStore.usageMs(for: tokenId)),
      ]
    }
  }
}
