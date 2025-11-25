package com.verisoulreactnative

/**
 * Standardized error codes for Verisoul React Native SDK
 * Matches the error codes in TypeScript (VerisoulErrorCodes.ts) and Swift (VerisoulErrorCodes.swift)
 */
object VerisoulErrorCodes {
    
    /**
     * WebView is not available on the device (missing, disabled, or corrupted)
     */
    const val WEBVIEW_UNAVAILABLE = "WEBVIEW_UNAVAILABLE"
    
    /**
     * Session is not available or could not be retrieved
     */
    const val SESSION_UNAVAILABLE = "SESSION_UNAVAILABLE"
    
    /**
     * Invalid environment parameter
     */
    const val INVALID_ENVIRONMENT = "INVALID_ENVIRONMENT"
}
