import FamilyControls
import Foundation
import ManagedSettings

@available(iOS 16.0, *)
enum IosTokenCatalog {
  static let tokenIdPrefix = "ios-token-"

  static func sortedTokens(from selection: FamilyActivitySelection) -> [ApplicationToken] {
    selection.applicationTokens.sorted { lhs, rhs in
      String(lhs.hashValue) < String(rhs.hashValue)
    }
  }

  static func tokenId(forSortedIndex index: Int) -> String {
    "\(tokenIdPrefix)\(index)"
  }

  static func token(for tokenId: String, in selection: FamilyActivitySelection) -> ApplicationToken? {
    guard tokenId.hasPrefix(tokenIdPrefix) else {
      return nil
    }

    let indexString = String(tokenId.dropFirst(tokenIdPrefix.count))
    guard let index = Int(indexString), index >= 0 else {
      return nil
    }

    let tokens = sortedTokens(from: selection)
    guard index < tokens.count else {
      return nil
    }

    return tokens[index]
  }

  static func tokenId(for token: ApplicationToken, in selection: FamilyActivitySelection) -> String? {
    let tokens = sortedTokens(from: selection)
    guard let index = tokens.firstIndex(of: token) else {
      return nil
    }

    return tokenId(forSortedIndex: index)
  }
}
