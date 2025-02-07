package com.verisoulreactnative

import ai.verisoul.sdk.Verisoul
import ai.verisoul.sdk.VerisoulEnvironment

import ai.verisoul.sdk.webview.VerisoulSessionCallback
import android.os.Handler
import android.os.Looper
import android.view.MotionEvent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

class VerisoulReactnativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val sdkLogLevels: Map<String, VerisoulEnvironment> = mapOf(
    "dev" to VerisoulEnvironment.Dev,
    "production" to VerisoulEnvironment.Prod,
    "sandbox" to VerisoulEnvironment.Sandbox,
    "staging" to VerisoulEnvironment.Sandbox
  )

  private val actions: Map<Int, Int> = mapOf(
    0 to MotionEvent.ACTION_DOWN,
    1 to MotionEvent.ACTION_UP,
    2 to MotionEvent.ACTION_MOVE,

    )


  override fun getName(): String {
    return NAME
  }

  private val mainHandler = Handler(Looper.getMainLooper())

  @ReactMethod
  fun getSessionId(promise: Promise) {
    mainHandler.post {
      try {
        Verisoul.getSessionId(object : VerisoulSessionCallback {
          override fun onFailure(exception: Exception) {
            promise.reject(exception)
          }

          override fun onSuccess(sessionId: String) {
            promise.resolve(sessionId)
          }
        })
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

  @ReactMethod
  fun configure(env: String, productId: String, promise: Promise) {
    mainHandler.post {
      try {
        val logLevel =
          sdkLogLevels[env] ?: throw IllegalArgumentException("Invalid environment: $env")
        Verisoul.init(reactApplicationContext, logLevel, productId)
        promise.resolve(Unit) // More idiomatic than empty string ""
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

    @ReactMethod
    fun onActionEvent(x:Float,y:Float,action: Int, promise: Promise) {

        try {
          val motionEvent = MotionEvent.obtain(
            System.currentTimeMillis(),
            System.currentTimeMillis(),
            action,
            x,
            y,
            0
          )
          Verisoul.onTouchEvent(motionEvent)

          promise.resolve(null);
        } catch (e: Exception) {
          promise.reject(e);
        }

    }


  companion object {
    const val NAME = "VerisoulReactnative"
  }
}
