import DeviceActivity
import SwiftUI

@main
struct KeeptReportExtension: DeviceActivityReportExtension {
  var body: some DeviceActivityReportScene {
    TrackedAppsReport { configuration in
      TrackedAppsReportView(configuration: configuration)
    }
  }
}
