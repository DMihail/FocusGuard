import FamilyControls
import Foundation

enum SelectedAppsPayloadBuilder {
  static func build(from selection: FamilyActivitySelection) -> [[String: String]] {
    let tokens = selection.applicationTokens.sorted { lhs, rhs in
      String(lhs.hashValue) < String(rhs.hashValue)
    }

    return tokens.enumerated().map { index, _ in
      let tokenId = "ios-token-\(index)"
      return [
        "packageName": tokenId,
        "appName": "Selected App \(index + 1)",
        "appImage": "",
        "category": "Other",
      ]
    }
  }
}
