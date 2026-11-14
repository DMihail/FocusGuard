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
  private static let lock = NSLock()
  private static var permissionsChangedListeners: [ListenerToken] = []
  private static var localDayChangedListeners: [DayKeyListenerToken] = []
  private static var monitorServiceStateListeners: [MonitorStateListenerToken] = []
  private static var trackedUsageChangedListeners: [ListenerToken] = []
  private static var pendingPermissionsChanged = false
  private static var pendingLocalDayKey: String?
  private static var pendingMonitorServiceState: Bool?
  private static var permissionsEmitScheduled = false
  private static var trackedUsageEmitScheduled = false
  private static var localDayEmitScheduled = false
  private static var monitorStateEmitScheduled = false

  @objc static func registerPermissionsChanged(_ callback: @escaping () -> Void) -> NSObject {
    let token = ListenerToken(callback)
    lock.lock()
    permissionsChangedListeners.append(token)
    lock.unlock()
    replayPendingPermissionsChanged()
    return token
  }

  @objc static func unregisterPermissionsChanged(_ token: NSObject) {
    guard let token = token as? ListenerToken else {
      return
    }

    lock.lock()
    permissionsChangedListeners.removeAll { $0 === token }
    lock.unlock()
  }

  @objc static func registerLocalDayChanged(_ callback: @escaping (String) -> Void) -> NSObject {
    let token = DayKeyListenerToken(callback)
    lock.lock()
    localDayChangedListeners.append(token)
    lock.unlock()
    replayPendingLocalDayChanged()
    return token
  }

  @objc static func unregisterLocalDayChanged(_ token: NSObject) {
    guard let token = token as? DayKeyListenerToken else {
      return
    }

    lock.lock()
    localDayChangedListeners.removeAll { $0 === token }
    lock.unlock()
  }

  @objc static func registerMonitorServiceState(_ callback: @escaping (Bool) -> Void) -> NSObject {
    let token = MonitorStateListenerToken(callback)
    lock.lock()
    monitorServiceStateListeners.append(token)
    lock.unlock()
    replayPendingMonitorServiceState()
    return token
  }

  @objc static func unregisterMonitorServiceState(_ token: NSObject) {
    guard let token = token as? MonitorStateListenerToken else {
      return
    }

    lock.lock()
    monitorServiceStateListeners.removeAll { $0 === token }
    lock.unlock()
  }

  @objc static func registerTrackedUsageChanged(_ callback: @escaping () -> Void) -> NSObject {
    let token = ListenerToken(callback)
    lock.lock()
    trackedUsageChangedListeners.append(token)
    lock.unlock()
    return token
  }

  @objc static func unregisterTrackedUsageChanged(_ token: NSObject) {
    guard let token = token as? ListenerToken else {
      return
    }

    lock.lock()
    trackedUsageChangedListeners.removeAll { $0 === token }
    lock.unlock()
  }

  @objc static func clearAll() {
    lock.lock()
    permissionsChangedListeners.removeAll()
    localDayChangedListeners.removeAll()
    monitorServiceStateListeners.removeAll()
    trackedUsageChangedListeners.removeAll()
    pendingPermissionsChanged = false
    pendingLocalDayKey = nil
    pendingMonitorServiceState = nil
    permissionsEmitScheduled = false
    trackedUsageEmitScheduled = false
    localDayEmitScheduled = false
    monitorStateEmitScheduled = false
    lock.unlock()
  }

  @objc static func emitPermissionsChanged() {
    lock.lock()
    if permissionsChangedListeners.isEmpty {
      pendingPermissionsChanged = true
      lock.unlock()
      return
    }

    if permissionsEmitScheduled {
      lock.unlock()
      return
    }

    permissionsEmitScheduled = true
    lock.unlock()
    scheduleOnMain {
      let handlers = snapshotPermissionHandlers()
      handlers.forEach { $0() }
    }
  }

  @objc static func emitLocalDayChanged(dayKey: String) {
    lock.lock()
    if localDayChangedListeners.isEmpty {
      pendingLocalDayKey = dayKey
      lock.unlock()
      return
    }

    pendingLocalDayKey = dayKey
    if localDayEmitScheduled {
      lock.unlock()
      return
    }

    localDayEmitScheduled = true
    lock.unlock()
    scheduleOnMain {
      let payload = takePendingLocalDayKey()
      guard let dayKey = payload else {
        return
      }

      let handlers = snapshotLocalDayHandlers()
      handlers.forEach { $0(dayKey) }
    }
  }

  @objc static func emitMonitorServiceState(isRunning: Bool) {
    lock.lock()
    if monitorServiceStateListeners.isEmpty {
      pendingMonitorServiceState = isRunning
      lock.unlock()
      return
    }

    pendingMonitorServiceState = isRunning
    if monitorStateEmitScheduled {
      lock.unlock()
      return
    }

    monitorStateEmitScheduled = true
    lock.unlock()
    scheduleOnMain {
      let payload = takePendingMonitorServiceState()
      guard let isRunning = payload else {
        return
      }

      let handlers = snapshotMonitorStateHandlers()
      handlers.forEach { $0(isRunning) }
    }
  }

  @objc static func emitTrackedUsageChanged() {
    lock.lock()
    if trackedUsageChangedListeners.isEmpty {
      lock.unlock()
      return
    }

    if trackedUsageEmitScheduled {
      lock.unlock()
      return
    }

    trackedUsageEmitScheduled = true
    lock.unlock()
    scheduleOnMain {
      let handlers = snapshotTrackedUsageHandlers()
      handlers.forEach { $0() }
    }
  }

  private static func scheduleOnMain(_ work: @escaping () -> Void) {
    if Thread.isMainThread {
      work()
    } else {
      DispatchQueue.main.async(execute: work)
    }
  }

  private static func snapshotPermissionHandlers() -> [() -> Void] {
    lock.lock()
    permissionsEmitScheduled = false
    let handlers = permissionsChangedListeners.map(\.handler)
    lock.unlock()
    return handlers
  }

  private static func snapshotTrackedUsageHandlers() -> [() -> Void] {
    lock.lock()
    trackedUsageEmitScheduled = false
    let handlers = trackedUsageChangedListeners.map(\.handler)
    lock.unlock()
    return handlers
  }

  private static func snapshotLocalDayHandlers() -> [(String) -> Void] {
    lock.lock()
    localDayEmitScheduled = false
    let handlers = localDayChangedListeners.map(\.handler)
    lock.unlock()
    return handlers
  }

  private static func snapshotMonitorStateHandlers() -> [(Bool) -> Void] {
    lock.lock()
    monitorStateEmitScheduled = false
    let handlers = monitorServiceStateListeners.map(\.handler)
    lock.unlock()
    return handlers
  }

  private static func takePendingLocalDayKey() -> String? {
    lock.lock()
    let dayKey = pendingLocalDayKey
    pendingLocalDayKey = nil
    lock.unlock()
    return dayKey
  }

  private static func takePendingMonitorServiceState() -> Bool? {
    lock.lock()
    let isRunning = pendingMonitorServiceState
    pendingMonitorServiceState = nil
    lock.unlock()
    return isRunning
  }

  private static func replayPendingPermissionsChanged() {
    lock.lock()
    guard pendingPermissionsChanged, !permissionsChangedListeners.isEmpty else {
      lock.unlock()
      return
    }

    pendingPermissionsChanged = false
    let handlers = permissionsChangedListeners.map(\.handler)
    lock.unlock()
    scheduleOnMain {
      handlers.forEach { $0() }
    }
  }

  private static func replayPendingLocalDayChanged() {
    lock.lock()
    guard let dayKey = pendingLocalDayKey, !localDayChangedListeners.isEmpty else {
      lock.unlock()
      return
    }

    pendingLocalDayKey = nil
    let handlers = localDayChangedListeners.map(\.handler)
    lock.unlock()
    scheduleOnMain {
      handlers.forEach { $0(dayKey) }
    }
  }

  private static func replayPendingMonitorServiceState() {
    lock.lock()
    guard let isRunning = pendingMonitorServiceState, !monitorServiceStateListeners.isEmpty else {
      lock.unlock()
      return
    }

    pendingMonitorServiceState = nil
    let handlers = monitorServiceStateListeners.map(\.handler)
    lock.unlock()
    scheduleOnMain {
      handlers.forEach { $0(isRunning) }
    }
  }
}
