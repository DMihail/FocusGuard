import DeviceActivity
import FamilyControls
import SwiftUI

struct TrackedAppsReport: DeviceActivityReportScene {
  let context: DeviceActivityReport.Context = KeeptUsageReportContext.tracked

  let content: (TrackedAppsReportConfiguration) -> TrackedAppsReportView

  func makeConfiguration(representing data: DeviceActivityResults<DeviceActivityData>) async -> TrackedAppsReportConfiguration {
    var usageMsByTokenId: [String: Int64] = [:]
    let selection = IosFamilyActivitySelectionStore.load()

    for await dataPoint in data {
      for await segment in dataPoint.activitySegments {
        for await category in segment.categories {
          for await applicationActivity in category.applications {
            guard
              let token = applicationActivity.application.token,
              let tokenId = IosTokenCatalog.tokenId(for: token, in: selection)
            else {
              continue
            }

            let usageMs = Int64(applicationActivity.totalActivityDuration * 1000)
            usageMsByTokenId[tokenId] = (usageMsByTokenId[tokenId] ?? 0) + usageMs
          }
        }
      }
    }

    IosDailyUsageStore.mergeReportUsage(usageMsByTokenId)

    return TrackedAppsReportConfiguration(usageMsByTokenId: usageMsByTokenId)
  }
}

struct TrackedAppsReportConfiguration {
  let usageMsByTokenId: [String: Int64]
}
