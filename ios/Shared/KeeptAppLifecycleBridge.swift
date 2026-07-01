import Foundation
import UIKit

/** Observes app foreground and timezone changes for native Turbo Module events. */
@objc final class KeeptAppLifecycleBridge: NSObject {
  private static var started = false

  @objc static func start() {
    guard !started else {
      return
    }

    started = true

    NotificationCenter.default.addObserver(
      forName: UIApplication.didBecomeActiveNotification,
      object: nil,
      queue: .main,
    ) { _ in
      KeeptNotificationAuthorization.refreshCachedAuthorization()
      KeeptLocalDayChangeNotifier.checkAndNotify()
      KeeptTurboModuleEventDispatchers.emitPermissionsChanged()
    }

    NotificationCenter.default.addObserver(
      forName: .NSSystemTimeZoneDidChange,
      object: nil,
      queue: .main,
    ) { _ in
      KeeptLocalDayChangeScheduler.schedule()
      KeeptLocalDayChangeNotifier.checkAndNotify()
    }

    KeeptLocalDayChangeScheduler.schedule()
    KeeptLocalDayChangeNotifier.checkAndNotify()
  }
}
