import FamilyControls
import Foundation

enum IosFamilyActivitySelectionStore {
  static func load() -> FamilyActivitySelection {
    guard
      let raw = KeeptAppGroup.defaults?.string(forKey: KeeptAppGroup.StorageKey.familyActivitySelection),
      let data = Data(base64Encoded: raw)
    else {
      return FamilyActivitySelection()
    }

    return (try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)) ?? FamilyActivitySelection()
  }

  static func save(_ selection: FamilyActivitySelection) {
    guard let data = try? JSONEncoder().encode(selection) else {
      return
    }

    KeeptAppGroup.defaults?.set(data.base64EncodedString(), forKey: KeeptAppGroup.StorageKey.familyActivitySelection)
  }
}
