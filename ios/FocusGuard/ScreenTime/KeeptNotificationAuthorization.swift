import Foundation
import UIKit
import UserNotifications

enum KeeptNotificationAuthorization {
  private static let lock = NSLock()
  private static var cachedAuthorized = false
  private static var hasCachedAuthorization = false

  static var isAuthorized: Bool {
    if Thread.isMainThread, hasCachedAuthorizationValue() {
      return readCachedAuthorized()
    }

    return fetchAuthorizedSynchronously()
  }

  static func refreshCachedAuthorization() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      store(
        authorized: settings.authorizationStatus == .authorized
          || settings.authorizationStatus == .provisional
      )
    }
  }

  static func invalidateCache() {
    lock.lock()
    cachedAuthorized = false
    hasCachedAuthorization = false
    lock.unlock()
    refreshCachedAuthorization()
  }

  static func request() async -> Bool {
    let granted = await withCheckedContinuation { continuation in
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
        granted,
        _ in
        continuation.resume(returning: granted)
      }
    }

    store(authorized: granted)
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

  private static func store(authorized: Bool) {
    lock.lock()
    cachedAuthorized = authorized
    hasCachedAuthorization = true
    lock.unlock()
  }

  private static func hasCachedAuthorizationValue() -> Bool {
    lock.lock()
    defer { lock.unlock() }
    return hasCachedAuthorization
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
      store(authorized: granted)
      semaphore.signal()
    }

    semaphore.wait()
    return granted
  }
}
