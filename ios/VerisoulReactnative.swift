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
      reject(VerisoulErrorCodes.INVALID_ENVIRONMENT, "Invalid environment value: \(environment)", nil)
      return
    }

    do {
      try Verisoul.shared.configure(env: env, projectId: projectId)
      resolve("Configuration successful")
    } catch {
      // Extract error code if available from the error
      let errorCode = extractErrorCode(from: error) ?? "UNKNOWN_ERROR"
      reject(errorCode, "SDK configuration failed: \(error.localizedDescription)", error)
    }
  }
  
  /// Extracts the error code from a Verisoul SDK error
  private func extractErrorCode(from error: Error) -> String? {
    // Check if the error description contains known error codes
    let errorDescription = error.localizedDescription.uppercased()
    if errorDescription.contains("WEBVIEW") {
      return VerisoulErrorCodes.WEBVIEW_UNAVAILABLE
    } else if errorDescription.contains("SESSION") {
      return VerisoulErrorCodes.SESSION_UNAVAILABLE
    }
    return nil
  }

  @objc(getSessionId:withRejecter:)  // ✅ Match the Objective-C bridge method
  func getSessionId(_ resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        let sessionId = try await Verisoul.shared.session()
        resolve(sessionId)
      } catch {
        // Extract error code if available, otherwise use SESSION_UNAVAILABLE
        let errorCode = extractErrorCode(from: error) ?? VerisoulErrorCodes.SESSION_UNAVAILABLE
        reject(errorCode, "Failed to retrieve session ID: \(error.localizedDescription)", error)
      }
    }
  }

  @objc(reinitialize:withRejecter:)  // ✅ Match the Objective-C bridge method
  func reinitialize(_ resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
    Task {
        Verisoul.shared.reinitialize()
        resolve(true)
    }
  }

}

