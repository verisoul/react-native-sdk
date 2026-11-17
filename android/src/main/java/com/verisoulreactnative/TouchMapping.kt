package com.verisoulreactnative

/**
 * Converts touch values sent from JavaScript to Android MotionEvent values.
 * Kept free of Android runtime calls so plain JVM unit tests can cover it.
 */
internal object TouchMapping {

  /**
   * Converts a React Native density-independent pixel value, measured from the React root view,
   * to physical screen pixels. [originPx] is where the root view starts on screen.
   */
  fun toScreenPixels(dp: Float, density: Float, originPx: Int): Float = dp * density + originPx
}
