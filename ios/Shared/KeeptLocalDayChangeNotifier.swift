import Foundation

/** Detects local day rollovers and notifies JS through [KeeptTurboModuleEventDispatchers]. */
@objc final class KeeptLocalDayChangeNotifier: NSObject {
  private static var lastDayKey: String?

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

    let dayKey = currentDayKey()
    let previousDayKey = lastDayKey
    lastDayKey = dayKey

    if let previousDayKey, previousDayKey != dayKey {
      publishDayChange(dayKey: dayKey)
    }
  }

  private static func consumePendingExtensionDayChangeIfNeeded() {
    guard
      let pendingDayKey = KeeptAppGroup.defaults?.string(forKey: KeeptAppGroup.StorageKey.pendingLocalDayChange),
      !pendingDayKey.isEmpty
    else {
      return
    }

    KeeptAppGroup.defaults?.removeObject(forKey: KeeptAppGroup.StorageKey.pendingLocalDayChange)
    lastDayKey = pendingDayKey
    publishDayChange(dayKey: pendingDayKey)
  }

  private static func publishDayChange(dayKey: String) {
    IosDailyUsageStore.resetForNewDayIfNeeded()
    KeeptTurboModuleEventDispatchers.emitLocalDayChanged(dayKey: dayKey)
  }
}
