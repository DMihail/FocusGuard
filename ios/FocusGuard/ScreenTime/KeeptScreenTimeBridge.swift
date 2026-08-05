import Foundation
import React

@objc(KeeptScreenTimeBridge)
final class KeeptScreenTimeBridge: NSObject {
  @objc static func isScreenTimeAuthorized() -> Bool {
    KeeptScreenTimeAuthorization.isAuthorized
  }

  @objc static func areNotificationsAuthorized() -> Bool {
    KeeptNotificationAuthorization.isAuthorized
  }

  @objc static func requestScreenTimeAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task { @MainActor in
      do {
        try await KeeptScreenTimeAuthorization.request()
        resolve(KeeptScreenTimeAuthorization.isAuthorized)
      } catch {
        reject("screen_time_auth_failed", error.localizedDescription, error)
      }
    }
  }

  @objc static func presentFamilyActivityPicker(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task { @MainActor in
      guard KeeptScreenTimeAuthorization.isAuthorized else {
        reject("screen_time_unauthorized", "Screen Time authorization is required.", nil)
        return
      }

      KeeptFamilyActivityPickerPresenter.present { result in
        switch result {
        case let .success(payload):
          resolve(payload)
        case let .failure(error):
          reject("family_activity_picker_failed", error.localizedDescription, error)
        }
      }
    }
  }

  @objc static func getSelectedApplications(
    _ resolve: RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
  ) {
    let selection = IosFamilyActivitySelectionStore.load()
    resolve(SelectedAppsPayloadBuilder.build(from: selection))
  }

  @objc static func requestNotificationsAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      let granted = await KeeptNotificationAuthorization.request()
      resolve(granted)
    }
  }

  @objc static func openNotificationsSettings() {
    KeeptNotificationAuthorization.openSettings()
  }

  @objc static func syncTrackingConfig(_ snapshotJson: String) {
    IosTrackingSnapshotStore.writeJson(snapshotJson)
    KeeptMonitoringScheduler.rescheduleIfRunning()
  }

  @objc static func startMonitorService() -> [String: Any] {
    do {
      let started = try KeeptMonitoringScheduler.start()
      return ["started": started]
    } catch KeeptMonitoringScheduler.StartFailure.unauthorized {
      return ["started": false, "reason": "screen_time_unauthorized"]
    } catch KeeptMonitoringScheduler.StartFailure.missingSnapshot {
      return ["started": false, "reason": "tracking_snapshot_missing"]
    } catch KeeptMonitoringScheduler.StartFailure.noTrackedApps {
      return ["started": false, "reason": "no_tracked_apps"]
    } catch {
      return ["started": false, "reason": "monitor_schedule_failed"]
    }
  }

  @objc static func stopMonitorService() {
    KeeptMonitoringScheduler.stop()
  }

  @objc static func isMonitorServiceRunning() -> Bool {
    KeeptMonitoringScheduler.isRunning
  }

  @objc static func getPackagesUsageToday(
    _ packageNames: [String],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task { @MainActor in
      await KeeptUsageReportCollector.refresh()
      resolve(KeeptUsageReader.buildPayload(packageNames: packageNames))
    }
  }

  @objc static func invalidateNativeInstalledAppsCache() {
    // Selection payload is rebuilt on each getSelectedApplications call; drop notification
    // auth sticky so the next permissions/catalog sync re-queries the system.
    KeeptNotificationAuthorization.invalidateCache()
  }

  @objc static func invalidateNativeUsageCache() {
    Task { @MainActor in
      KeeptUsageReportCollector.invalidate()
    }
  }
}
