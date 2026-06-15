import DeviceActivity
import FamilyControls
import ManagedSettings

/// Device Activity Monitor extension — warning notifications and ManagedSettings shields.
final class DeviceActivityMonitorExtension: DeviceActivityMonitor {
  override func intervalDidStart(for activity: DeviceActivityName) {
    super.intervalDidStart(for: activity)
    KeeptMonitorActions.handleIntervalStart()
  }

  override func intervalDidEnd(for activity: DeviceActivityName) {
    super.intervalDidEnd(for: activity)
    IosShieldStore.clearAll()
  }

  override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
    super.eventDidReachThreshold(event, activity: activity)

    if let tokenId = KeeptMonitoringNames.tokenId(fromWarningEvent: event) {
      KeeptMonitorActions.handleWarning(tokenId: tokenId)
      return
    }

    if let tokenId = KeeptMonitoringNames.tokenId(fromBlockEvent: event) {
      KeeptMonitorActions.handleBlock(tokenId: tokenId)
    }
  }
}
