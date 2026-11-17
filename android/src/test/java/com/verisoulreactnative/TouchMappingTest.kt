package com.verisoulreactnative

import org.junit.Assert.assertEquals
import org.junit.Test

/** Touch coordinates sent from JavaScript convert to physical pixels. */
class TouchMappingTest {

  @Test
  fun densityIndependentPixels_scaleByDensity() {
    assertEquals(1080f, TouchMapping.toPhysicalPixels(411.42856f, 2.625f), 0.01f)
    assertEquals(100f, TouchMapping.toPhysicalPixels(100f, 1f), 0f)
  }
}
