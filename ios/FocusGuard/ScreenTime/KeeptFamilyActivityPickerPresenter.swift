import FamilyControls
import SwiftUI
import UIKit

@MainActor
enum KeeptFamilyActivityPickerPresenter {
  typealias Completion = (Result<[[String: String]], Error>) -> Void

  private static var completion: Completion?

  static func present(_ onComplete: @escaping Completion) {
    completion = onComplete

    guard let presenter = topViewController() else {
      onComplete(.failure(PickerError.missingPresenter))
      completion = nil
      return
    }

    var selection = FamilyActivitySelectionStore.load()
    let pickerView = FamilyActivityPickerSheet(
      selection: selection,
      onCancel: { dismiss(from: presenter, result: .success([])) },
      onDone: { updatedSelection in
        FamilyActivitySelectionStore.save(updatedSelection)
        let payload = SelectedAppsPayloadBuilder.build(from: updatedSelection)
        dismiss(from: presenter, result: .success(payload))
      },
    )

    let hostingController = UIHostingController(rootView: pickerView)
    hostingController.modalPresentationStyle = .formSheet
    presenter.present(hostingController, animated: true)
  }

  private static func dismiss(from presenter: UIViewController, result: Result<[[String: String]], Error>) {
    presenter.dismiss(animated: true) {
      completion?(result)
      completion = nil
    }
  }

  private static func topViewController() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let keyWindow = scenes.flatMap(\.windows).first { $0.isKeyWindow }
    var controller = keyWindow?.rootViewController

    while let presented = controller?.presentedViewController {
      controller = presented
    }

    return controller
  }

  enum PickerError: LocalizedError {
    case missingPresenter

    var errorDescription: String? {
      switch self {
      case .missingPresenter:
        return "Unable to present the Screen Time app picker."
      }
    }
  }
}

private struct FamilyActivityPickerSheet: View {
  @Environment(\.dismiss) private var dismiss
  @State private var selection: FamilyActivitySelection

  private let onCancel: () -> Void
  private let onDone: (FamilyActivitySelection) -> Void

  init(
    selection: FamilyActivitySelection,
    onCancel: @escaping () -> Void,
    onDone: @escaping (FamilyActivitySelection) -> Void
  ) {
    _selection = State(initialValue: selection)
    self.onCancel = onCancel
    self.onDone = onDone
  }

  var body: some View {
    NavigationStack {
      FamilyActivityPicker(selection: $selection)
        .navigationTitle("Choose Apps")
        .toolbar {
          ToolbarItem(placement: .cancellationAction) {
            Button("Cancel", action: onCancel)
          }
          ToolbarItem(placement: .confirmationAction) {
            Button("Done") {
              onDone(selection)
            }
          }
        }
    }
  }
}
