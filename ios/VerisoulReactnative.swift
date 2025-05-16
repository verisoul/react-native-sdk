import VerisoulSDK
import Foundation

@objc(VerisoulReactnative)
class VerisoulReactnative: NSObject {

  static let sdkLogLevels: [String: VerisoulSDK.VerisoulEnvironment] = [
    "dev": .dev,
    "production": .prod,
    "sandbox": .sandbox,
    "staging": .staging
  ]

  @objc(configure:withProjectId:withResolver:withRejecter:)
  func configure(_ environment: String, withProjectId projectId: String,
                 withResolver resolve: @escaping RCTPromiseResolveBlock,
                 withRejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let env = VerisoulReactnative.sdkLogLevels[environment] else {
      reject("INVALID_ENV", "Invalid environment value: \(environment)", nil)
      return
    }

    Verisoul.shared.configure(env: env, projectId: projectId)
    resolve("Configuration successful")
  }

  @MainActor
  @objc(getSessionId:withRejecter:)  // ✅ Match the Objective-C bridge method
  func getSessionId(_ resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        let sessionId = try await Verisoul.shared.session()
        resolve(sessionId)
      } catch {
        reject("0", "Failed to retrieve session ID: \(error.localizedDescription)", error)
      }
    }
  }

  @MainActor
  @objc(reinitialize:withRejecter:)  // ✅ Match the Objective-C bridge method
  func reinitialize(_ resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
    Task {
        Verisoul.shared.reinitialize()
        resolve(true)
    }
  }

}

