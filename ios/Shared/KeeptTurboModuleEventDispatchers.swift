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

  @objc static func registerPermissionsChanged(_ callback: @escaping () -> Void) -> NSObject {
    let token = ListenerToken(callback)
    permissionsChangedListeners.append(token)
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
  }

  @objc static func emitPermissionsChanged() {
    permissionsChangedListeners.forEach { $0.handler() }
  }

  @objc static func emitLocalDayChanged(dayKey: String) {
    localDayChangedListeners.forEach { $0.handler(dayKey) }
  }

  @objc static func emitMonitorServiceState(isRunning: Bool) {
    monitorServiceStateListeners.forEach { $0.handler(isRunning) }
  }
}
