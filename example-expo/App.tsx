import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Switch,
} from 'react-native';
import Verisoul, {
  VerisoulEnvironment,
  VerisoulTouchRootView,
} from '@verisoul_ai/react-native-verisoul';
import {
  runRepeatTest,
  runChaosTest,
  type TestResults,
} from './src/testHarness';
import ResultsView from './src/ResultsView';

// Configure these values for your Verisoul project
// For testing, use 'dev' environment and your project ID
const VERISOUL_ENV = 'dev';
const VERISOUL_PROJECT_ID = 'your-project-id'; // Replace with your actual project ID

// Map env string to VerisoulEnvironment
const getEnvironment = (env: string): VerisoulEnvironment => {
  switch (env?.toLowerCase()) {
    case 'production':
      return VerisoulEnvironment.production;
    case 'sandbox':
      return VerisoulEnvironment.sandbox;
    case 'staging':
      return VerisoulEnvironment.staging;
    case 'dev':
    default:
      return VerisoulEnvironment.dev;
  }
};

enum SDKStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
}

interface ConfigError {
  code: string | undefined;
  message: string | undefined;
}

export default function App() {
  // Test state
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [testType, setTestType] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Repeat Test Config
  const [repeatRounds, setRepeatRounds] = useState('10');
  const [reinitMultiple, setReinitMultiple] = useState('3');
  const [parallelMode, setParallelMode] = useState(false);

  // Chaos Test Config
  const [chaosRounds, setChaosRounds] = useState('40');

  // SDK configuration state
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>(SDKStatus.LOADING);
  const [configError, setConfigError] = useState<ConfigError | null>(null);

  // Network unavailable test state
  const [networkTestRunning, setNetworkTestRunning] = useState(false);
  const [networkTestResult, setNetworkTestResult] = useState<{
    status: 'idle' | 'running' | 'passed' | 'failed';
    expectedCode: string;
    actualCode: string | undefined;
    message: string | undefined;
    duration: number | undefined;
  } | null>(null);

  const configureSDK = async () => {
    setSdkStatus(SDKStatus.LOADING);
    setConfigError(null);
    try {
      await Verisoul.configure({
        environment: getEnvironment(VERISOUL_ENV),
        projectId: VERISOUL_PROJECT_ID,
      });
      console.log('Verisoul SDK configured successfully');

      // Reinitialize to clear any cached session and force new WebView creation
      // This will surface errors like WEBVIEW_UNAVAILABLE
      try {
        console.log('Reinitializing SDK to verify WebView availability...');
        await Verisoul.reinitialize();
        console.log('Getting fresh session ID...');
        const sessionId = await Verisoul.getSessionID();
        console.log('Session ID obtained:', sessionId.substring(0, 8) + '...');
        setSdkStatus(SDKStatus.SUCCESS);
      } catch (sessionError: any) {
        const errorInfo = {
          code: sessionError?.code,
          message: sessionError?.message,
        };
        console.error('SDK verification failed:', errorInfo);
        setConfigError(errorInfo);
        setSdkStatus(SDKStatus.FAILED);
      }
    } catch (error: any) {
      const errorInfo = {
        code: error?.code,
        message: error?.message,
      };
      console.error('Failed to configure Verisoul SDK:', errorInfo);
      setConfigError(errorInfo);
      setSdkStatus(SDKStatus.FAILED);
    }
  };

  useEffect(() => {
    configureSDK();
  }, []);

  const isDisabled = sdkStatus !== SDKStatus.SUCCESS || isRunning;

  const handleRepeatTest = async () => {
    setIsRunning(true);
    setTestType(
      parallelMode ? 'Repeat Test (Parallel)' : 'Repeat Test (Sequential)'
    );

    const results = await runRepeatTest(
      parseInt(repeatRounds, 10) || 10,
      parseInt(reinitMultiple, 10) || 3,
      parallelMode
    );

    setTestResults(results);
    setIsRunning(false);
    setShowResults(true);
  };

  const handleChaosTest = async () => {
    setIsRunning(true);
    setTestType('Chaos Test');

    const results = await runChaosTest(parseInt(chaosRounds, 10) || 40, 8);

    setTestResults(results);
    setIsRunning(false);
    setShowResults(true);
  };

  const handleNetworkUnavailableTest = async () => {
    setNetworkTestRunning(true);
    setNetworkTestResult({
      status: 'running',
      expectedCode: 'SESSION_UNAVAILABLE',
      actualCode: undefined,
      message: 'Test in progress... This may take up to 2 minutes.',
      duration: undefined,
    });

    const startTime = Date.now();

    try {
      console.log('[Network Test] Starting network unavailable test...');
      console.log('[Network Test] Calling reinitialize()...');
      await Verisoul.reinitialize();

      console.log('[Network Test] Calling getSessionID()...');
      const sessionId = await Verisoul.getSessionID();

      // If we get here, the test failed - we expected an error
      const duration = Date.now() - startTime;
      console.log(
        '[Network Test] Unexpected success - got session:',
        sessionId.substring(0, 8) + '...'
      );
      setNetworkTestResult({
        status: 'failed',
        expectedCode: 'SESSION_UNAVAILABLE',
        actualCode: 'none (success)',
        message: `Got session ID instead of error. Is airplane mode enabled? Session: ${sessionId.substring(0, 8)}...`,
        duration,
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorCode = error?.code;
      const errorMessage = error?.message;

      console.log('[Network Test] Error received:', {
        code: errorCode,
        message: errorMessage,
      });

      const passed = errorCode === 'SESSION_UNAVAILABLE';
      setNetworkTestResult({
        status: passed ? 'passed' : 'failed',
        expectedCode: 'SESSION_UNAVAILABLE',
        actualCode: errorCode || 'undefined',
        message: errorMessage,
        duration,
      });
    } finally {
      setNetworkTestRunning(false);
    }
  };

  return (
    <VerisoulTouchRootView>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Verisoul SDK Test Suite</Text>
            <Text style={styles.headerSubtitle}>(Expo)</Text>
          </View>

          {/* SDK Status */}
          <View style={styles.statusContainer}>
            {sdkStatus === SDKStatus.FAILED ? (
              <View>
                <Text style={styles.statusError}>SDK Configuration Failed</Text>
                {configError && (
                  <View style={styles.errorDetails}>
                    <Text style={styles.errorCode}>
                      Error Code: {configError.code || 'undefined'}
                    </Text>
                    <Text style={styles.errorMessage}>
                      Message: {configError.message || 'undefined'}
                    </Text>
                  </View>
                )}
              </View>
            ) : sdkStatus === SDKStatus.SUCCESS ? (
              <Text style={styles.statusSuccess}>SDK Configured</Text>
            ) : (
              <Text style={styles.statusLoading}>Configuring SDK...</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Repeat Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Repeat Test</Text>

            <View style={styles.configBox}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Number of Rounds:</Text>
                <TextInput
                  style={styles.input}
                  value={repeatRounds}
                  onChangeText={setRepeatRounds}
                  keyboardType="number-pad"
                  placeholder="10"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Reinitialize Every:</Text>
                <TextInput
                  style={styles.input}
                  value={reinitMultiple}
                  onChangeText={setReinitMultiple}
                  keyboardType="number-pad"
                  placeholder="3"
                />
                <Text style={styles.inputLabel}>rounds</Text>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Parallel Mode (Fire All at Once)
                </Text>
                <Switch
                  value={parallelMode}
                  onValueChange={setParallelMode}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={parallelMode ? '#007AFF' : '#f4f3f4'}
                />
              </View>

              <Text style={styles.modeDescription}>
                {parallelMode
                  ? '⚡ All requests fire simultaneously'
                  : '📝 Requests run sequentially'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.blueButton,
                isDisabled && styles.disabledButton,
              ]}
              onPress={handleRepeatTest}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>🔁 Run Repeat Test</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Chaos Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chaos Test</Text>

            <View style={styles.configBox}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Number of Rounds:</Text>
                <TextInput
                  style={styles.input}
                  value={chaosRounds}
                  onChangeText={setChaosRounds}
                  keyboardType="number-pad"
                  placeholder="40"
                />
              </View>

              <Text style={styles.chaosDescription}>
                Runs 8 concurrent workers with random delays
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.orangeButton,
                isDisabled && styles.disabledButton,
              ]}
              onPress={handleChaosTest}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>🌪️ Run Chaos Test</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Error Code Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WebView Unavailable Test</Text>

            <View style={styles.configBox}>
              <Text style={styles.chaosDescription}>
                Tests WEBVIEW_UNAVAILABLE error code propagation.
              </Text>
              <Text
                style={[
                  styles.chaosDescription,
                  { marginTop: 10, fontWeight: '600' },
                ]}
              >
                Test Steps:
              </Text>
              <Text style={styles.chaosDescription}>
                1. Disable WebView on emulator:
              </Text>
              <Text
                style={[
                  styles.chaosDescription,
                  { fontFamily: 'monospace', fontSize: 11, marginLeft: 10 },
                ]}
              >
                adb shell pm disable-user --user 0 com.google.android.webview
              </Text>
              <Text style={styles.chaosDescription}>
                2. Restart/Rebuild the app
              </Text>
              <Text style={styles.chaosDescription}>
                3. SDK configure() should fail with WEBVIEW_UNAVAILABLE
              </Text>
            </View>

            {/* Show automatic test result based on initial configure() */}
            {sdkStatus === SDKStatus.FAILED && configError && (
              <View
                style={[
                  styles.testResultBox,
                  configError.code === 'WEBVIEW_UNAVAILABLE'
                    ? styles.testResultPass
                    : styles.testResultFail,
                ]}
              >
                <Text style={styles.testResultTitle}>
                  {configError.code === 'WEBVIEW_UNAVAILABLE'
                    ? '✅ TEST PASSED'
                    : '❌ TEST FAILED (wrong error code)'}
                </Text>
                <Text style={styles.testResultText}>
                  Expected: WEBVIEW_UNAVAILABLE
                </Text>
                <Text style={styles.testResultText}>
                  Actual: {configError.code || 'undefined'}
                </Text>
                <Text style={styles.testResultMessage}>
                  {configError.message}
                </Text>
              </View>
            )}

            {sdkStatus === SDKStatus.SUCCESS && (
              <View style={[styles.testResultBox, styles.testResultFail]}>
                <Text style={styles.testResultTitle}>
                  ⚠️ WebView is Available
                </Text>
                <Text style={styles.testResultMessage}>
                  SDK configured successfully. To test WEBVIEW_UNAVAILABLE,
                  disable WebView first and restart the app.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.redButton,
                sdkStatus === SDKStatus.LOADING && styles.disabledButton,
              ]}
              onPress={configureSDK}
              disabled={sdkStatus === SDKStatus.LOADING}
            >
              <Text style={styles.buttonText}>🔄 Retry SDK Configuration</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Network Unavailable Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Unavailable Test</Text>

            <View style={styles.configBox}>
              <Text style={styles.chaosDescription}>
                Tests SESSION_UNAVAILABLE error code when network is
                unavailable.
              </Text>
              <Text
                style={[
                  styles.chaosDescription,
                  { marginTop: 10, fontWeight: '600' },
                ]}
              >
                Test Steps:
              </Text>
              <Text style={styles.chaosDescription}>
                1. Enable Airplane Mode on the emulator
              </Text>
              <Text style={styles.chaosDescription}>
                2. Press the "Run Network Test" button below
              </Text>
              <Text style={styles.chaosDescription}>
                3. Wait ~2 minutes for SDK retries to exhaust
              </Text>
              <Text style={styles.chaosDescription}>
                4. Should receive SESSION_UNAVAILABLE error
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.purpleButton,
                networkTestRunning && styles.disabledButton,
              ]}
              onPress={handleNetworkUnavailableTest}
              disabled={networkTestRunning}
            >
              <Text style={styles.buttonText}>
                {networkTestRunning
                  ? '⏳ Test Running...'
                  : '✈️ Run Network Unavailable Test'}
              </Text>
            </TouchableOpacity>

            {networkTestResult && (
              <View
                style={[
                  styles.testResultBox,
                  networkTestResult.status === 'running'
                    ? styles.testResultRunning
                    : networkTestResult.status === 'passed'
                      ? styles.testResultPass
                      : styles.testResultFail,
                ]}
              >
                <Text style={styles.testResultTitle}>
                  {networkTestResult.status === 'running'
                    ? '⏳ TEST RUNNING'
                    : networkTestResult.status === 'passed'
                      ? '✅ TEST PASSED'
                      : '❌ TEST FAILED'}
                </Text>
                <Text style={styles.testResultText}>
                  Expected: {networkTestResult.expectedCode}
                </Text>
                <Text style={styles.testResultText}>
                  Actual: {networkTestResult.actualCode || 'pending...'}
                </Text>
                {networkTestResult.duration !== undefined && (
                  <Text style={styles.testResultText}>
                    Duration: {(networkTestResult.duration / 1000).toFixed(1)}s
                  </Text>
                )}
                <Text style={styles.testResultMessage}>
                  {networkTestResult.message}
                </Text>
              </View>
            )}
          </View>

          {isRunning && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Running test...</Text>
            </View>
          )}
        </ScrollView>

        {/* Results Modal */}
        <Modal
          visible={showResults}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowResults(false)}
        >
          {testResults && (
            <ResultsView
              results={testResults}
              testType={testType}
              onDismiss={() => {
                setShowResults(false);
                setTestResults(null);
              }}
            />
          )}
        </Modal>
      </SafeAreaView>
    </VerisoulTouchRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusSuccess: {
    fontSize: 14,
    color: '#060',
  },
  statusError: {
    fontSize: 14,
    color: '#c00',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: '#fff0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorCode: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#c00',
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    marginTop: 5,
  },
  statusLoading: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  configBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    textAlign: 'right',
    minWidth: 80,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  chaosDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  blueButton: {
    backgroundColor: '#007AFF',
  },
  orangeButton: {
    backgroundColor: '#FF9500',
  },
  redButton: {
    backgroundColor: '#FF3B30',
  },
  purpleButton: {
    backgroundColor: '#5856D6',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  testResultBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
  },
  testResultPass: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  testResultFail: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  testResultRunning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  testResultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testResultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  testResultMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
