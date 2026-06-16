import FamilyControls

enum KeeptScreenTimeAuthorization {
  static var isAuthorized: Bool {
    AuthorizationCenter.shared.authorizationStatus == .approved
  }

  @MainActor
  static func request() async throws {
    try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
  }
}
