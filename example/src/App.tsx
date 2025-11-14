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
import { runRepeatTest, runChaosTest, type TestResults } from './testHarness';
import ResultsView from './ResultsView';

enum SDKStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
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

  const configureSDK = async () => {
    setSdkStatus(SDKStatus.LOADING);
    try {
      await Verisoul.configure({
        environment: VerisoulEnvironment.dev,
        projectId: '00000000-0000-0000-0000-000000000001',
      });
      console.log('Verisoul SDK configured successfully');
      setSdkStatus(SDKStatus.SUCCESS);
    } catch (error: any) {
      console.error('Failed to configure Verisoul SDK:', {
        code: error?.code,
        message: error?.message,
      });
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

  return (
    <VerisoulTouchRootView>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Verisoul SDK Test Suite</Text>
          </View>

          {/* SDK Status */}
          <View style={styles.statusContainer}>
            {sdkStatus === SDKStatus.FAILED ? (
              <Text style={styles.statusError}>SDK Configuration Failed</Text>
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
  headerIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
  disabledButton: {
    backgroundColor: '#999',
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
