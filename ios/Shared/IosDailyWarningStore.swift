import Foundation

enum IosDailyWarningStore {
  static func wasWarningShownToday(tokenId: String) -> Bool {
    KeeptAppGroup.defaults?.bool(forKey: storageKey(for: tokenId)) ?? false
  }

  static func markWarningShownToday(tokenId: String) {
    KeeptAppGroup.defaults?.set(true, forKey: storageKey(for: tokenId))
  }

  private static func storageKey(for tokenId: String) -> String {
    let calendar = Calendar.current
    let components = calendar.dateComponents([.year, .month, .day], from: Date())
    let dayKey = "\(components.year ?? 0)-\(components.month ?? 0)-\(components.day ?? 0)"
    return "\(KeeptAppGroup.StorageKey.dailyWarningPrefix)\(dayKey)-\(tokenId)"
  }
}
