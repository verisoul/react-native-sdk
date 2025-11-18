/**
 * Standardized error codes for Verisoul React Native SDK
 * These match the native error codes in VerisoulErrorCodes.kt (Android) and VerisoulErrorCodes.swift (iOS)
 */
export const VerisoulErrorCodes = {
  /**
   * WebView is not available on the device (missing, disabled, or corrupted)
   */
  WEBVIEW_UNAVAILABLE: 'WEBVIEW_UNAVAILABLE',

  /**
   * Session is not available or could not be retrieved
   */
  SESSION_UNAVAILABLE: 'SESSION_UNAVAILABLE',

  /**
   * SDK configuration failed
   */
  SDK_ERROR: 'SDK_ERROR',

  /**
   * Invalid environment parameter
   */
  INVALID_ENVIRONMENT: 'INVALID_ENVIRONMENT',
} as const;

export type VerisoulErrorCode =
  (typeof VerisoulErrorCodes)[keyof typeof VerisoulErrorCodes];
