import Foundation
import UIKit
import UserNotifications

enum KeeptNotificationAuthorization {
  private static let lock = NSLock()
  private static var cachedAuthorized = false

  static var isAuthorized: Bool {
    if Thread.isMainThread {
      return readCachedAuthorized()
    }

    return fetchAuthorizedSynchronously()
  }

  static func refreshCachedAuthorization() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      lock.lock()
      cachedAuthorized =
        settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional
      lock.unlock()
    }
  }

  static func request() async -> Bool {
    let granted = await withCheckedContinuation { continuation in
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
        granted,
        _ in
        continuation.resume(returning: granted)
      }
    }

    lock.lock()
    cachedAuthorized = granted
    lock.unlock()
    return granted
  }

  static func openSettings() {
    guard let url = URL(string: UIApplication.openSettingsURLString) else {
      return
    }

    DispatchQueue.main.async {
      UIApplication.shared.open(url)
    }
  }

  private static func readCachedAuthorized() -> Bool {
    lock.lock()
    defer { lock.unlock() }
    return cachedAuthorized
  }

  private static func fetchAuthorizedSynchronously() -> Bool {
    var granted = false
    let semaphore = DispatchSemaphore(value: 0)

    UNUserNotificationCenter.current().getNotificationSettings { settings in
      granted =
        settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional
      lock.lock()
      cachedAuthorized = granted
      lock.unlock()
      semaphore.signal()
    }

    semaphore.wait()
    return granted
  }
}
