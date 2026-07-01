import Foundation

/** Routes native lifecycle signals to the active Turbo Module instance. */
@objc final class KeeptTurboModuleEventDispatchers: NSObject {
  private static var permissionsChangedEmit: (() -> Void)?
  private static var localDayChangedEmit: ((String) -> Void)?
  private static var monitorServiceStateEmit: ((Bool) -> Void)?

  @objc static func registerPermissionsChanged(_ callback: @escaping () -> Void) {
    permissionsChangedEmit = callback
  }

  @objc static func registerLocalDayChanged(_ callback: @escaping (String) -> Void) {
    localDayChangedEmit = callback
  }

  @objc static func registerMonitorServiceState(_ callback: @escaping (Bool) -> Void) {
    monitorServiceStateEmit = callback
  }

  @objc static func clearAll() {
    permissionsChangedEmit = nil
    localDayChangedEmit = nil
    monitorServiceStateEmit = nil
  }

  @objc static func emitPermissionsChanged() {
    permissionsChangedEmit?()
  }

  @objc static func emitLocalDayChanged(dayKey: String) {
    localDayChangedEmit?(dayKey)
  }

  @objc static func emitMonitorServiceState(isRunning: Bool) {
    monitorServiceStateEmit?(isRunning)
  }
}
