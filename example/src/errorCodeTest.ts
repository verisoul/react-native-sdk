/**
 * Error Code Propagation Test
 *
 * This test verifies that native SDK error codes are properly propagated
 * to the React Native layer.
 *
 * To test WEBVIEW_UNAVAILABLE:
 * 1. Disable WebView on Android emulator:
 *    adb shell pm disable-user --user 0 com.google.android.webview
 * 2. Run this test
 * 3. Re-enable WebView after testing:
 *    adb shell pm enable com.google.android.webview
 */

import Verisoul, {
  VerisoulErrorCodes,
} from '@verisoul_ai/react-native-verisoul';

export interface ErrorCodeTestResult {
  testName: string;
  passed: boolean;
  expectedCode: string | null;
  actualCode: string | null;
  message: string;
  error?: any;
}

/**
 * Test that getSessionID returns proper error codes
 */
export async function testGetSessionIdErrorCode(): Promise<ErrorCodeTestResult> {
  const testName = 'getSessionID Error Code Test';

  try {
    console.log(`[${testName}] Attempting to get session ID...`);
    const sessionId = await Verisoul.getSessionID();

    // If we get here, session was retrieved successfully (no error to test)
    return {
      testName,
      passed: true,
      expectedCode: null,
      actualCode: null,
      message: `Session retrieved successfully: ${sessionId.substring(0, 8)}...`,
    };
  } catch (error: any) {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    console.log(`[${testName}] Error caught:`, {
      code: errorCode,
      message: errorMessage,
    });

    // Check if we got a valid error code from the native SDK
    const validErrorCodes = [
      VerisoulErrorCodes.WEBVIEW_UNAVAILABLE,
      VerisoulErrorCodes.SESSION_UNAVAILABLE,
      VerisoulErrorCodes.INVALID_ENVIRONMENT,
    ];

    const hasValidErrorCode = validErrorCodes.includes(errorCode);

    return {
      testName,
      passed: hasValidErrorCode,
      expectedCode:
        'One of: WEBVIEW_UNAVAILABLE, SESSION_UNAVAILABLE, INVALID_ENVIRONMENT',
      actualCode: errorCode || 'undefined',
      message: hasValidErrorCode
        ? `✅ Received valid error code: ${errorCode}`
        : `❌ Invalid or missing error code: ${errorCode}`,
      error,
    };
  }
}

/**
 * Test specifically for WEBVIEW_UNAVAILABLE error code
 * This test is designed to be run when WebView is disabled on the device
 */
export async function testWebViewUnavailableErrorCode(): Promise<ErrorCodeTestResult> {
  const testName = 'WEBVIEW_UNAVAILABLE Error Code Test';
  const expectedCode = VerisoulErrorCodes.WEBVIEW_UNAVAILABLE;

  try {
    console.log(
      `[${testName}] Calling reinitialize() to clear cached session...`
    );

    // First, reinitialize to clear any cached session
    // This forces the SDK to create a new session, which requires WebView
    await Verisoul.reinitialize();

    console.log(
      `[${testName}] Reinitialize complete. Now attempting to get session ID...`
    );
    console.log(`[${testName}] Expected error code: ${expectedCode}`);

    const sessionId = await Verisoul.getSessionID();

    // If we get here, WebView might still be enabled
    return {
      testName,
      passed: false,
      expectedCode,
      actualCode: null,
      message: `❌ Expected WEBVIEW_UNAVAILABLE error but session was retrieved: ${sessionId.substring(0, 8)}... (Is WebView still enabled?)`,
    };
  } catch (error: any) {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    console.log(`[${testName}] Error caught:`, {
      code: errorCode,
      message: errorMessage,
      fullError: JSON.stringify(error, null, 2),
    });

    const passed = errorCode === expectedCode;

    return {
      testName,
      passed,
      expectedCode,
      actualCode: errorCode || 'undefined',
      message: passed
        ? `✅ PASS: Received expected error code: ${errorCode}`
        : `❌ FAIL: Expected ${expectedCode} but got ${errorCode || 'undefined'}`,
      error,
    };
  }
}

/**
 * Run all error code tests
 */
export async function runAllErrorCodeTests(): Promise<ErrorCodeTestResult[]> {
  console.log('========================================');
  console.log('Starting Error Code Propagation Tests');
  console.log('========================================\n');

  const results: ErrorCodeTestResult[] = [];

  // Test 1: General error code test
  results.push(await testGetSessionIdErrorCode());

  console.log('\n========================================');
  console.log('Error Code Tests Complete');
  console.log('========================================');

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Results: ${passed} passed, ${failed} failed`);

  results.forEach((r) => {
    console.log(`  ${r.passed ? '✅' : '❌'} ${r.testName}: ${r.message}`);
  });

  return results;
}

/**
 * Run WebView unavailable test specifically
 * Call this when WebView is disabled on the device
 */
export async function runWebViewUnavailableTest(): Promise<ErrorCodeTestResult> {
  console.log('========================================');
  console.log('WebView Unavailable Error Code Test');
  console.log('========================================');
  console.log('');
  console.log('Prerequisites:');
  console.log('  1. WebView must be disabled on the device');
  console.log(
    '  2. Run: adb shell pm disable-user --user 0 com.google.android.webview'
  );
  console.log('');
  console.log('Starting test...\n');

  const result = await testWebViewUnavailableErrorCode();

  console.log('\n========================================');
  console.log('Test Result');
  console.log('========================================');
  console.log(`Status: ${result.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Expected: ${result.expectedCode}`);
  console.log(`Actual: ${result.actualCode}`);
  console.log(`Message: ${result.message}`);

  return result;
}
