import Foundation

/** Detects local day rollovers and notifies JS through [KeeptTurboModuleEventDispatchers]. */
@objc final class KeeptLocalDayChangeNotifier: NSObject {
  private static var lastNotifiedDayKey: String?

  @objc static func currentDayKey(calendar: Calendar = .current) -> String {
    IosDailyUsageStore.currentDayKey(calendar: calendar)
  }

  @objc static func msUntilNextLocalMidnight(
    dateMs: TimeInterval = Date().timeIntervalSince1970 * 1000,
    calendar: Calendar = .current,
  ) -> Int64 {
    let date = Date(timeIntervalSince1970: dateMs / 1000)
    var components = calendar.dateComponents([.year, .month, .day], from: date)
    components.hour = 24
    components.minute = 0
    components.second = 0
    components.nanosecond = 0

    guard let nextMidnight = calendar.date(from: components) else {
      return 0
    }

    return Int64(max(0, nextMidnight.timeIntervalSince1970 * 1000 - dateMs))
  }

  @objc static func checkAndNotify() {
    consumePendingExtensionDayChangeIfNeeded()
    notifyIfDayChanged(currentDayKey())
  }

  @objc static func markDayChangeNotified(_ dayKey: String) {
    lastNotifiedDayKey = dayKey
    writePersistedDayKey(dayKey)
  }

  private static func notifyIfDayChanged(_ dayKey: String) {
    let previousDayKey = lastNotifiedDayKey ?? readPersistedDayKey()

    if !shouldPublishLocalDayChange(previousDayKey: previousDayKey, currentDayKey: dayKey) {
      if previousDayKey == nil {
        markDayChangeNotified(dayKey)
      }
      return
    }

    publishDayChange(dayKey: dayKey)
  }

  private static func shouldPublishLocalDayChange(previousDayKey: String?, currentDayKey: String) -> Bool {
    guard let previousDayKey else {
      return false
    }

    return previousDayKey != currentDayKey
  }

  private static func readPersistedDayKey() -> String? {
    guard let dayKey = KeeptAppGroup.defaults?.string(forKey: KeeptAppGroup.StorageKey.lastLocalDayKey) else {
      return nil
    }

    let trimmed = dayKey.trimmingCharacters(in: .whitespacesAndNewlines)
    return trimmed.isEmpty ? nil : trimmed
  }

  private static func writePersistedDayKey(_ dayKey: String) {
    KeeptAppGroup.defaults?.set(dayKey, forKey: KeeptAppGroup.StorageKey.lastLocalDayKey)
  }

  private static func consumePendingExtensionDayChangeIfNeeded() {
    guard
      let pendingDayKey = KeeptAppGroup.defaults?.string(forKey: KeeptAppGroup.StorageKey.pendingLocalDayChange),
      !pendingDayKey.isEmpty
    else {
      return
    }

    KeeptAppGroup.defaults?.removeObject(forKey: KeeptAppGroup.StorageKey.pendingLocalDayChange)

    let todayKey = currentDayKey()
    guard pendingDayKey == todayKey else {
      return
    }

    let previousDayKey = lastNotifiedDayKey ?? readPersistedDayKey()
    guard shouldPublishLocalDayChange(previousDayKey: previousDayKey, currentDayKey: pendingDayKey) else {
      return
    }

    publishDayChange(dayKey: pendingDayKey)
  }

  private static func publishDayChange(dayKey: String) {
    IosDailyUsageStore.resetForNewDayIfNeeded()
    KeeptTurboModuleEventDispatchers.emitLocalDayChanged(dayKey: dayKey)
  }
}
