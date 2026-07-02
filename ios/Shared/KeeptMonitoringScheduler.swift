import DeviceActivity
import FamilyControls
import Foundation

enum KeeptMonitoringScheduler {
  enum StartFailure: Error {
    case unauthorized
    case missingSnapshot
    case noTrackedApps
    case scheduleFailed
  }

  private static let center = DeviceActivityCenter()

  static var isRunning: Bool {
    center.activities.contains(KeeptMonitoringNames.dailyActivity)
  }

  @discardableResult
  static func start() throws -> Bool {
    guard AuthorizationCenter.shared.authorizationStatus == .approved else {
      throw StartFailure.unauthorized
    }

    guard let snapshot = IosTrackingSnapshotStore.read() else {
      throw StartFailure.missingSnapshot
    }

    let selection = IosFamilyActivitySelectionStore.load()
    let events = buildEvents(snapshot: snapshot, selection: selection)

    guard !events.isEmpty else {
      throw StartFailure.noTrackedApps
    }

    stop()

    let schedule = DeviceActivitySchedule(
      intervalStart: DateComponents(hour: 0, minute: 0, second: 0),
      intervalEnd: DateComponents(hour: 23, minute: 59, second: 59),
      repeats: true
    )

    do {
      try center.startMonitoring(KeeptMonitoringNames.dailyActivity, during: schedule, events: events)
      KeeptMonitoringStateStore.setEnabled(true)
      KeeptTurboModuleEventDispatchers.emitMonitorServiceState(isRunning: true)
      return true
    } catch {
      throw StartFailure.scheduleFailed
    }
  }

  static func stop() {
    center.stopMonitoring([KeeptMonitoringNames.dailyActivity])
    IosShieldStore.clearAll()
    KeeptMonitoringStateStore.setEnabled(false)
    KeeptTurboModuleEventDispatchers.emitMonitorServiceState(isRunning: false)
  }

  static func rescheduleIfRunning() {
    guard isRunning else {
      return
    }

    _ = try? start()
  }

  private static func buildEvents(
    snapshot: IosTrackingSnapshot,
    selection: FamilyActivitySelection
  ) -> [DeviceActivityEvent.Name: DeviceActivityEvent] {
    var events: [DeviceActivityEvent.Name: DeviceActivityEvent] = [:]

    for tokenId in snapshot.trackedAppTokenIds {
      guard
        let token = IosTokenCatalog.token(for: tokenId, in: selection),
        let limits = snapshot.limitsByTokenId[tokenId]
      else {
        continue
      }

      let warningMinutes = max(1, limits.warningMinutes)
      let hardBlockMinutes = max(warningMinutes, limits.hardBlockMinutes)

      events[KeeptMonitoringNames.warningEvent(for: tokenId)] = DeviceActivityEvent(
        applications: Set([token]),
        threshold: DateComponents(minute: warningMinutes)
      )
      events[KeeptMonitoringNames.blockEvent(for: tokenId)] = DeviceActivityEvent(
        applications: Set([token]),
        threshold: DateComponents(minute: hardBlockMinutes)
      )
    }

    return events
  }
}
