import DeviceActivity
import Foundation

enum KeeptMonitoringNames {
  static let dailyActivity = DeviceActivityName("keept.daily")

  static func warningEvent(for tokenId: String) -> DeviceActivityEvent.Name {
    DeviceActivityEvent.Name("keept.warning.\(tokenId)")
  }

  static func blockEvent(for tokenId: String) -> DeviceActivityEvent.Name {
    DeviceActivityEvent.Name("keept.block.\(tokenId)")
  }

  static func tokenId(fromWarningEvent event: DeviceActivityEvent.Name) -> String? {
    parseTokenId(from: event.rawValue, prefix: "keept.warning.")
  }

  static func tokenId(fromBlockEvent event: DeviceActivityEvent.Name) -> String? {
    parseTokenId(from: event.rawValue, prefix: "keept.block.")
  }

  private static func parseTokenId(from rawValue: String, prefix: String) -> String? {
    guard rawValue.hasPrefix(prefix) else {
      return nil
    }

    let tokenId = String(rawValue.dropFirst(prefix.count))
    return tokenId.isEmpty ? nil : tokenId
  }
}
