import BackgroundTasks
import Foundation

/** Schedules a background app refresh for the next local midnight (iOS analogue of AlarmManager). */
@objc final class KeeptLocalDayChangeScheduler: NSObject {
  static let taskIdentifier = "com.keept.local-day-change"

  @objc static func registerBackgroundTasks() {
    BGTaskScheduler.shared.register(forTaskWithIdentifier: taskIdentifier, using: nil) { task in
      guard let refreshTask = task as? BGAppRefreshTask else {
        task.setTaskCompleted(success: false)
        return
      }

      refreshTask.expirationHandler = {
        refreshTask.setTaskCompleted(success: false)
      }

      KeeptLocalDayChangeNotifier.checkAndNotify()
      schedule()
      refreshTask.setTaskCompleted(success: true)
    }
  }

  @objc static func schedule() {
    BGTaskScheduler.shared.cancel(taskRequestWithIdentifier: taskIdentifier)

    let request = BGAppRefreshTaskRequest(identifier: taskIdentifier)
    let delaySeconds = TimeInterval(KeeptLocalDayChangeNotifier.msUntilNextLocalMidnight()) / 1000 + 0.05
    request.earliestBeginDate = Date().addingTimeInterval(delaySeconds)

    do {
      try BGTaskScheduler.shared.submit(request)
    } catch {
      // OS may reject overlapping requests; foreground/significant-time observers remain as fallback.
    }
  }

  @objc static func stop() {
    BGTaskScheduler.shared.cancel(taskRequestWithIdentifier: taskIdentifier)
  }
}
