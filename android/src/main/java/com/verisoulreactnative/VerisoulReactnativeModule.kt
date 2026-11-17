package com.verisoulreactnative

import ai.verisoul.sdk.InternalVerisoulCore
import ai.verisoul.sdk.SDKType
import ai.verisoul.sdk.Verisoul
import ai.verisoul.sdk.VerisoulEnvironment
import ai.verisoul.sdk.VerisoulException
import ai.verisoul.sdk.helpers.webview.VerisoulSessionCallback
import android.os.SystemClock
import android.view.MotionEvent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class VerisoulReactnativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val sdkLogLevels: Map<String, VerisoulEnvironment> = mapOf(
    "dev" to VerisoulEnvironment.Dev,
    "production" to VerisoulEnvironment.Prod,
    "sandbox" to VerisoulEnvironment.Sandbox,
    "staging" to VerisoulEnvironment.Sandbox
  )


  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun getSessionId(promise: Promise) {
    try {
      Verisoul.getSessionId(object : VerisoulSessionCallback {
        override fun onFailure(exception: Throwable) {
          val errorCode = (exception as? VerisoulException)?.code ?: VerisoulErrorCodes.SESSION_UNAVAILABLE
          promise.reject(errorCode, "Failed to retrieve session ID: ${exception.message}", exception)
        }

        override fun onSuccess(sessionId: String) {
          promise.resolve(sessionId)
        }
      })
    } catch (e: Exception) {
      val errorCode = (e as? VerisoulException)?.code ?: VerisoulErrorCodes.SESSION_UNAVAILABLE
      promise.reject(errorCode, "Failed to retrieve session ID: ${e.message}", e)
    }
  }

  @ReactMethod
  fun reinitialize(promise: Promise) {
    try {
      Verisoul.reinitialize()
      promise.resolve(true)
    } catch (e: Exception) {
      val errorCode = (e as? VerisoulException)?.code ?: "UNKNOWN_ERROR"
      promise.reject(errorCode, "Failed to reinitialize SDK: ${e.message}", e)
    }
  }

  @ReactMethod
  fun configure(env: String, productId: String, customHostname: String?, promise: Promise) {
    try {
      val logLevel = sdkLogLevels[env]
      if (logLevel == null) {
        promise.reject(VerisoulErrorCodes.INVALID_ENVIRONMENT, "Invalid environment value: $env")
        return
      }
      
      InternalVerisoulCore.sdkType = SDKType.ReactNative
      if (customHostname != null) {
        // Loads the SDK WebView from the custom hostname, with no fallback to the Verisoul host.
        Verisoul.init(reactApplicationContext, logLevel, productId, false, customHostname)
      } else {
        Verisoul.init(reactApplicationContext, logLevel, productId)
      }
      promise.resolve(true)
    } catch (e: Exception) {
      val errorCode = (e as? VerisoulException)?.code ?: "UNKNOWN_ERROR"
      promise.reject(errorCode, "SDK configuration failed: ${e.message}", e)
    }
  }

  @ReactMethod
  fun onActionEvent(x: Float, y: Float, action: Int, promise: Promise) {

    try {
      // The native SDK samples presses only, so other actions stop here.
      if (action != MotionEvent.ACTION_DOWN) {
        promise.resolve(null)
        return
      }

      // MotionEvent times are on the uptime clock; the native SDK converts them to Unix time.
      val now = SystemClock.uptimeMillis()
      // JavaScript sends density-independent pixels; native Android touch events use physical pixels.
      val density = reactApplicationContext.resources.displayMetrics.density
      val motionEvent = MotionEvent.obtain(
        now,
        now,
        action,
        TouchMapping.toPhysicalPixels(x, density),
        TouchMapping.toPhysicalPixels(y, density),
        0
      )
      try {
        Verisoul.onTouchEvent(motionEvent)
      } finally {
        motionEvent.recycle()
      }

      promise.resolve(null);
    } catch (e: Exception) {
      promise.reject(e);
    }

  }


  companion object {
    const val NAME = "VerisoulReactnative"
  }
}
