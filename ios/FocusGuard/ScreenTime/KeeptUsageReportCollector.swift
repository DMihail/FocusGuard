import DeviceActivity
import FamilyControls
import SwiftUI
import UIKit

@MainActor
enum KeeptUsageReportCollector {
  private static let freshTtlSeconds: TimeInterval = 45
  private static let reportMountSleepNs: UInt64 = 1_000_000_000

  private static var hostController: UIHostingController<KeeptUsageReportHostView>?
  private static var refreshTask: Task<Void, Never>?
  private static var lastRefreshAt: Date?
  private static var lastDayKey: String?
  private static var lastSelectionFingerprint: String?

  static func invalidate() {
    refreshTask?.cancel()
    refreshTask = nil
    lastRefreshAt = nil
    lastDayKey = nil
    lastSelectionFingerprint = nil
    unmountReport()
  }

  static func refresh() async {
    if let refreshTask {
      await refreshTask.value
      return
    }

    let task = Task { @MainActor in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        return
      }

      let selection = IosFamilyActivitySelectionStore.load()
      guard !selection.applicationTokens.isEmpty else {
        return
      }

      let dayKey = IosDailyUsageStore.currentDayKey()
      let selectionFingerprint = selectionFingerprint(for: selection)

      if
        let lastRefreshAt,
        lastDayKey == dayKey,
        lastSelectionFingerprint == selectionFingerprint,
        Date().timeIntervalSince(lastRefreshAt) < freshTtlSeconds
      {
        return
      }

      guard let interval = Calendar.current.dateInterval(of: .day, for: Date()) else {
        return
      }

      let filter = DeviceActivityFilter(
        segment: .daily(during: interval),
        users: .all,
        devices: .init([.iPhone, .iPad]),
        applications: selection.applicationTokens
      )

      mountReport(filter: filter)
      try? await Task.sleep(nanoseconds: reportMountSleepNs)
      unmountReport()

      lastRefreshAt = Date()
      lastDayKey = dayKey
      lastSelectionFingerprint = selectionFingerprint
    }

    refreshTask = task
    await task.value
    refreshTask = nil
    KeeptTrackedUsageChangeEmitter.maybeEmit()
  }

  private static func selectionFingerprint(for selection: FamilyActivitySelection) -> String {
    selection.applicationTokens
      .map { String(describing: $0.hashValue) }
      .sorted()
      .joined(separator: ",")
  }

  private static func mountReport(filter: DeviceActivityFilter) {
    unmountReport()

    guard let window = keyWindow() else {
      return
    }

    let host = UIHostingController(rootView: KeeptUsageReportHostView(filter: filter))
    host.view.frame = CGRect(x: 0, y: 0, width: 1, height: 1)
    host.view.alpha = 0.01
    window.addSubview(host.view)
    hostController = host
  }

  private static func unmountReport() {
    hostController?.view.removeFromSuperview()
    hostController = nil
  }

  private static func keyWindow() -> UIWindow? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first(where: \.isKeyWindow)
  }
}

private struct KeeptUsageReportHostView: View {
  let filter: DeviceActivityFilter

  var body: some View {
    DeviceActivityReport(KeeptUsageReportContext.tracked, filter: filter)
  }
}
