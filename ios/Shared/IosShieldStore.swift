import FamilyControls
import Foundation
import ManagedSettings

enum IosShieldStore {
  private static let store = ManagedSettingsStore(named: .keept)

  static func shield(token: ApplicationToken) {
    var applications = store.shield.applications ?? Set()
    applications.insert(token)
    store.shield.applications = applications
  }

  static func removeShield(token: ApplicationToken) {
    guard var applications = store.shield.applications else {
      return
    }

    applications.remove(token)
    store.shield.applications = applications.isEmpty ? nil : applications
  }

  static func clearAll() {
    store.clearAllSettings()
  }
}

private extension ManagedSettingsStore.Name {
  static let keept = Self("keept")
}
