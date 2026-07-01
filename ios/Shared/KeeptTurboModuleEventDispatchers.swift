import Foundation

private final class ListenerToken: NSObject {
  let handler: () -> Void

  init(_ handler: @escaping () -> Void) {
    self.handler = handler
  }
}

private final class DayKeyListenerToken: NSObject {
  let handler: (String) -> Void

  init(_ handler: @escaping (String) -> Void) {
    self.handler = handler
  }
}

private final class MonitorStateListenerToken: NSObject {
  let handler: (Bool) -> Void

  init(_ handler: @escaping (Bool) -> Void) {
    self.handler = handler
  }
}

/** Routes native lifecycle signals to active Turbo Module listeners. */
@objc final class KeeptTurboModuleEventDispatchers: NSObject {
  private static var permissionsChangedListeners: [ListenerToken] = []
  private static var localDayChangedListeners: [DayKeyListenerToken] = []
  private static var monitorServiceStateListeners: [MonitorStateListenerToken] = []
  private static var pendingPermissionsChanged = false
  private static var pendingLocalDayKey: String?
  private static var pendingMonitorServiceState: Bool?

  @objc static func registerPermissionsChanged(_ callback: @escaping () -> Void) -> NSObject {
    let token = ListenerToken(callback)
    permissionsChangedListeners.append(token)
    replayPendingPermissionsChanged()
    return token
  }

  @objc static func unregisterPermissionsChanged(_ token: NSObject) {
    guard let token = token as? ListenerToken else {
      return
    }

    permissionsChangedListeners.removeAll { $0 === token }
  }

  @objc static func registerLocalDayChanged(_ callback: @escaping (String) -> Void) -> NSObject {
    let token = DayKeyListenerToken(callback)
    localDayChangedListeners.append(token)
    replayPendingLocalDayChanged()
    return token
  }

  @objc static func unregisterLocalDayChanged(_ token: NSObject) {
    guard let token = token as? DayKeyListenerToken else {
      return
    }

    localDayChangedListeners.removeAll { $0 === token }
  }

  @objc static func registerMonitorServiceState(_ callback: @escaping (Bool) -> Void) -> NSObject {
    let token = MonitorStateListenerToken(callback)
    monitorServiceStateListeners.append(token)
    replayPendingMonitorServiceState()
    return token
  }

  @objc static func unregisterMonitorServiceState(_ token: NSObject) {
    guard let token = token as? MonitorStateListenerToken else {
      return
    }

    monitorServiceStateListeners.removeAll { $0 === token }
  }

  @objc static func clearAll() {
    permissionsChangedListeners.removeAll()
    localDayChangedListeners.removeAll()
    monitorServiceStateListeners.removeAll()
    pendingPermissionsChanged = false
    pendingLocalDayKey = nil
    pendingMonitorServiceState = nil
  }

  @objc static func emitPermissionsChanged() {
    if permissionsChangedListeners.isEmpty {
      pendingPermissionsChanged = true
      return
    }

    permissionsChangedListeners.forEach { $0.handler() }
  }

  @objc static func emitLocalDayChanged(dayKey: String) {
    if localDayChangedListeners.isEmpty {
      pendingLocalDayKey = dayKey
      return
    }

    localDayChangedListeners.forEach { $0.handler(dayKey) }
  }

  @objc static func emitMonitorServiceState(isRunning: Bool) {
    if monitorServiceStateListeners.isEmpty {
      pendingMonitorServiceState = isRunning
      return
    }

    monitorServiceStateListeners.forEach { $0.handler(isRunning) }
  }

  private static func replayPendingPermissionsChanged() {
    guard pendingPermissionsChanged, !permissionsChangedListeners.isEmpty else {
      return
    }

    pendingPermissionsChanged = false
    permissionsChangedListeners.forEach { $0.handler() }
  }

  private static func replayPendingLocalDayChanged() {
    guard let dayKey = pendingLocalDayKey, !localDayChangedListeners.isEmpty else {
      return
    }

    pendingLocalDayKey = nil
    localDayChangedListeners.forEach { $0.handler(dayKey) }
  }

  private static func replayPendingMonitorServiceState() {
    guard let isRunning = pendingMonitorServiceState, !monitorServiceStateListeners.isEmpty else {
      return
    }

    pendingMonitorServiceState = nil
    monitorServiceStateListeners.forEach { $0.handler(isRunning) }
  }
}
