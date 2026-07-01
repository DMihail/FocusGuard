import Foundation

/** Routes native lifecycle signals to active Turbo Module listeners. */
@objc final class KeeptTurboModuleEventDispatchers: NSObject {
  private static var permissionsChangedListeners: [() -> Void] = []
  private static var localDayChangedListeners: [(String) -> Void] = []
  private static var monitorServiceStateListeners: [(Bool) -> Void] = []

  @objc static func registerPermissionsChanged(_ callback: @escaping () -> Void) {
    permissionsChangedListeners.append(callback)
  }

  @objc static func unregisterPermissionsChanged(_ callback: @escaping () -> Void) {
    permissionsChangedListeners.removeAll { $0 as AnyObject === callback as AnyObject }
  }

  @objc static func registerLocalDayChanged(_ callback: @escaping (String) -> Void) {
    localDayChangedListeners.append(callback)
  }

  @objc static func unregisterLocalDayChanged(_ callback: @escaping (String) -> Void) {
    localDayChangedListeners.removeAll { $0 as AnyObject === callback as AnyObject }
  }

  @objc static func registerMonitorServiceState(_ callback: @escaping (Bool) -> Void) {
    monitorServiceStateListeners.append(callback)
  }

  @objc static func unregisterMonitorServiceState(_ callback: @escaping (Bool) -> Void) {
    monitorServiceStateListeners.removeAll { $0 as AnyObject === callback as AnyObject }
  }

  @objc static func clearAll() {
    permissionsChangedListeners.removeAll()
    localDayChangedListeners.removeAll()
    monitorServiceStateListeners.removeAll()
  }

  @objc static func emitPermissionsChanged() {
    permissionsChangedListeners.forEach { $0() }
  }

  @objc static func emitLocalDayChanged(dayKey: String) {
    localDayChangedListeners.forEach { $0(dayKey) }
  }

  @objc static func emitMonitorServiceState(isRunning: Bool) {
    monitorServiceStateListeners.forEach { $0(isRunning) }
  }
}
