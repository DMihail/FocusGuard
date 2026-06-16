import FamilyControls
import Foundation

enum SelectedAppsPayloadBuilder {
  static func build(from selection: FamilyActivitySelection) -> [[String: String]] {
    IosTokenCatalog.sortedTokens(from: selection).enumerated().map { index, _ in
      let tokenId = IosTokenCatalog.tokenId(forSortedIndex: index)
      return [
        "tokenId": tokenId,
        "packageName": tokenId,
        "appName": "Selected App \(index + 1)",
        "appImage": "",
        "category": "Other",
      ]
    }
  }
}
