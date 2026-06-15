import Foundation
import UIKit
import UserNotifications

enum KeeptNotificationAuthorization {
  static var isAuthorized: Bool {
    var granted = false
    let semaphore = DispatchSemaphore(value: 0)

    UNUserNotificationCenter.current().getNotificationSettings { settings in
      granted = settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional
      semaphore.signal()
    }

    semaphore.wait()
    return granted
  }

  static func request() async -> Bool {
    await withCheckedContinuation { continuation in
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
        continuation.resume(returning: granted)
      }
    }
  }

  static func openSettings() {
    guard let url = URL(string: UIApplication.openSettingsURLString) else {
      return
    }

    DispatchQueue.main.async {
      UIApplication.shared.open(url)
    }
  }
}
