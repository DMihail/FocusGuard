import Foundation

/** Throttles tracked-usage change signals to JS while monitoring is active. */
enum KeeptTrackedUsageChangeEmitter {
  private static let minEmitInterval: TimeInterval = 2.0
  private static var lastEmittedAt: TimeInterval = 0

  static func maybeEmit() {
    let now = Date().timeIntervalSince1970

    if now - lastEmittedAt < minEmitInterval {
      return
    }

    lastEmittedAt = now
    KeeptTurboModuleEventDispatchers.emitTrackedUsageChanged()
  }

  static func onLocalDayChanged() {
    lastEmittedAt = 0
  }
}
