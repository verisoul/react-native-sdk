package com.verisoulreactnative

/**
 * Converts touch values sent from JavaScript to Android MotionEvent values.
 * Kept free of Android runtime calls so plain JVM unit tests can cover it.
 */
internal object TouchMapping {

  /** Converts a React Native density-independent pixel value to physical pixels. */
  fun toPhysicalPixels(dp: Float, density: Float): Float = dp * density
}
