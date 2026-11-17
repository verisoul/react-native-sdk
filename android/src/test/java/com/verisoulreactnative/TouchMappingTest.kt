package com.verisoulreactnative

import org.junit.Assert.assertEquals
import org.junit.Test

/** Touch coordinates sent from JavaScript convert to physical screen pixels. */
class TouchMappingTest {

  @Test
  fun densityIndependentPixels_scaleByDensity() {
    assertEquals(1080f, TouchMapping.toScreenPixels(411.42856f, 2.625f, 0), 0.01f)
    assertEquals(100f, TouchMapping.toScreenPixels(100f, 1f, 0), 0f)
  }

  @Test
  fun rootViewOrigin_isAdded() {
    // A root view that starts below a 132 px status bar.
    assertEquals(400f, TouchMapping.toScreenPixels(102.095f, 2.625f, 132), 0.01f)
  }
}
