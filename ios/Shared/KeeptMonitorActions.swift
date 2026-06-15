import FamilyControls
import Foundation
import UserNotifications

enum KeeptMonitorActions {
  static func handleIntervalStart() {
    IosShieldStore.clearAll()
    IosDailyUsageStore.resetForNewDayIfNeeded()
  }

  static func handleWarning(tokenId: String) {
    if let warningMinutes = IosTrackingSnapshotStore.read()?.limitsByTokenId[tokenId]?.warningMinutes {
      IosDailyUsageStore.recordAtLeastUsageMinutes(tokenId: tokenId, minutes: warningMinutes)
    }

    guard !IosDailyWarningStore.wasWarningShownToday(tokenId: tokenId) else {
      return
    }

    let content = UNMutableNotificationContent()
    content.title = "Usage limit warning"
    content.body = "You've reached your warning limit for a tracked app."
    content.sound = .default

    let request = UNNotificationRequest(
      identifier: "keept-warning-\(tokenId)",
      content: content,
      trigger: nil
    )

    UNUserNotificationCenter.current().add(request)
    IosDailyWarningStore.markWarningShownToday(tokenId: tokenId)
  }

  static func handleBlock(tokenId: String) {
    guard
      let snapshot = IosTrackingSnapshotStore.read(),
      let limits = snapshot.limitsByTokenId[tokenId],
      let token = IosTokenCatalog.token(for: tokenId, in: IosFamilyActivitySelectionStore.load())
    else {
      return
    }

    IosDailyUsageStore.recordAtLeastUsageMinutes(tokenId: tokenId, minutes: limits.hardBlockMinutes)

    if IosTrackingSnoozeStore.isSnoozed(tokenId: tokenId) {
      return
    }

    IosDailyWarningStore.markWarningShownToday(tokenId: tokenId)
    IosShieldStore.shield(token: token)
  }
}
