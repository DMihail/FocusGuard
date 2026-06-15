import Foundation

/// Flat tracking snapshot contract shared with JS (`source/store/iosTrackingSnapshot.ts`).
struct IosTrackingSnapshot: Codable, Equatable {
  struct AppLimits: Codable, Equatable {
    let warningMinutes: Int
    let hardBlockMinutes: Int
    let strictMode: Bool
  }

  static let currentVersion = 2

  let version: Int
  let platform: String
  let authMode: String
  let trackedAppTokenIds: [String]
  let limitsByTokenId: [String: AppLimits]

  init(
    trackedAppTokenIds: [String],
    limitsByTokenId: [String: AppLimits],
    authMode: String = KeeptAppGroup.screenTimeAuthMode
  ) {
    version = Self.currentVersion
    platform = "ios"
    self.authMode = authMode
    self.trackedAppTokenIds = trackedAppTokenIds
    self.limitsByTokenId = limitsByTokenId
  }

  var isValid: Bool {
    version <= Self.currentVersion &&
      platform == "ios" &&
      authMode == KeeptAppGroup.screenTimeAuthMode
  }
}

enum IosTrackingSnapshotStore {
  static func read(from defaults: UserDefaults? = KeeptAppGroup.defaults) -> IosTrackingSnapshot? {
    guard
      let raw = defaults?.string(forKey: KeeptAppGroup.StorageKey.iosTrackingSnapshot),
      let data = raw.data(using: .utf8)
    else {
      return nil
    }

    let decoder = JSONDecoder()
    guard let snapshot = try? decoder.decode(IosTrackingSnapshot.self, from: data), snapshot.isValid else {
      return nil
    }

    return snapshot
  }

  static func write(_ snapshot: IosTrackingSnapshot, to defaults: UserDefaults? = KeeptAppGroup.defaults) {
    let encoder = JSONEncoder()
    guard let data = try? encoder.encode(snapshot), let raw = String(data: data, encoding: .utf8) else {
      return
    }

    defaults?.set(raw, forKey: KeeptAppGroup.StorageKey.iosTrackingSnapshot)
  }
}
