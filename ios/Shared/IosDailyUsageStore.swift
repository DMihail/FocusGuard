import Foundation

struct IosDailyUsageSnapshot: Codable, Equatable {
  let dayKey: String
  var usageMsByTokenId: [String: Int64]
}

enum IosDailyUsageStore {
  private static let encoder = JSONEncoder()
  private static let decoder = JSONDecoder()

  static func currentDayKey(calendar: Calendar = .current) -> String {
    let components = calendar.dateComponents([.year, .month, .day], from: Date())
    return "\(components.year ?? 0)-\(components.month ?? 0)-\(components.day ?? 0)"
  }

  static func resetForNewDayIfNeeded(calendar: Calendar = .current) {
    let today = currentDayKey(calendar: calendar)
    var snapshot = readSnapshot()

    if snapshot.dayKey != today {
      snapshot = IosDailyUsageSnapshot(dayKey: today, usageMsByTokenId: [:])
      writeSnapshot(snapshot)
    }
  }

  static func usageMs(for tokenId: String) -> Int64 {
    resetForNewDayIfNeeded()
    return readSnapshot().usageMsByTokenId[tokenId] ?? 0
  }

  static func recordAtLeastUsageMs(tokenId: String, usageMs: Int64) {
    resetForNewDayIfNeeded()
    var snapshot = readSnapshot()
    let current = snapshot.usageMsByTokenId[tokenId] ?? 0

    if usageMs > current {
      snapshot.usageMsByTokenId[tokenId] = usageMs
      writeSnapshot(snapshot)
    }
  }

  static func recordAtLeastUsageMinutes(tokenId: String, minutes: Int) {
    recordAtLeastUsageMs(tokenId: tokenId, usageMs: Int64(max(0, minutes)) * 60_000)
  }

  static func mergeReportUsage(_ usageMsByTokenId: [String: Int64]) {
    resetForNewDayIfNeeded()
    guard !usageMsByTokenId.isEmpty else {
      return
    }

    var snapshot = readSnapshot()

    for (tokenId, usageMs) in usageMsByTokenId {
      let current = snapshot.usageMsByTokenId[tokenId] ?? 0
      snapshot.usageMsByTokenId[tokenId] = max(current, usageMs)
    }

    writeSnapshot(snapshot)
  }

  static func clearTodayUsage() {
    writeSnapshot(IosDailyUsageSnapshot(dayKey: currentDayKey(), usageMsByTokenId: [:]))
  }

  private static func readSnapshot() -> IosDailyUsageSnapshot {
    guard
      let raw = KeeptAppGroup.defaults?.string(forKey: KeeptAppGroup.StorageKey.iosDailyUsage),
      let data = raw.data(using: .utf8),
      let snapshot = try? decoder.decode(IosDailyUsageSnapshot.self, from: data)
    else {
      return IosDailyUsageSnapshot(dayKey: currentDayKey(), usageMsByTokenId: [:])
    }

    return snapshot
  }

  private static func writeSnapshot(_ snapshot: IosDailyUsageSnapshot) {
    guard let data = try? encoder.encode(snapshot), let raw = String(data: data, encoding: .utf8) else {
      return
    }

    KeeptAppGroup.defaults?.set(raw, forKey: KeeptAppGroup.StorageKey.iosDailyUsage)
  }
}
