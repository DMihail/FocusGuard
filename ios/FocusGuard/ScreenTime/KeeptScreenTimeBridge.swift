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
    let selection = FamilyActivitySelectionStore.load()
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
  }
}
