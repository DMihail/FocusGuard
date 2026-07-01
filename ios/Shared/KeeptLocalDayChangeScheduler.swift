import Foundation

/** Schedules a one-shot timer for the next local midnight while the app process is alive. */
@objc final class KeeptLocalDayChangeScheduler: NSObject {
  private static var midnightTimer: Timer?

  @objc static func schedule() {
    midnightTimer?.invalidate()

    let intervalSeconds = TimeInterval(KeeptLocalDayChangeNotifier.msUntilNextLocalMidnight()) / 1000 + 0.05
    midnightTimer =
      Timer.scheduledTimer(withTimeInterval: intervalSeconds, repeats: false) { _ in
        KeeptLocalDayChangeNotifier.onMidnightTimer()
        schedule()
      }
  }

  @objc static func stop() {
    midnightTimer?.invalidate()
    midnightTimer = nil
  }
}
