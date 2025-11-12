import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import type { TestResults } from './testHarness';

interface ResultsViewProps {
  results: TestResults;
  testType: string;
  onDismiss: () => void;
}

interface StatRowProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

const StatRow: React.FC<StatRowProps> = ({ icon, title, value, color }) => {
  return (
    <View style={styles.statRow}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  testType,
  onDismiss,
}) => {
  const successRate =
    results.totalRounds > 0
      ? (results.successCount / results.totalRounds) * 100
      : 0;

  const minLatency =
    results.sessionLatencies.length > 0
      ? Math.min(...results.sessionLatencies)
      : 0;

  const maxLatency =
    results.sessionLatencies.length > 0
      ? Math.max(...results.sessionLatencies)
      : 0;

  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 95) return '#28a745';
    if (rate >= 80) return '#FF9500';
    return '#dc3545';
  };

  const getLatencyColor = (latency: number): string => {
    if (latency < 100) return '#28a745';
    if (latency < 500) return '#FF9500';
    return '#dc3545';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Test Results</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.headerRight}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Icon and Title */}
        <View style={styles.topSection}>
          <Text style={styles.resultIcon}>
            {results.failureCount === 0 ? '✅' : '⚠️'}
          </Text>
          <Text style={styles.testTypeText}>{testType}</Text>
          <Text style={styles.resultsLabel}>Results</Text>
        </View>

        <View style={styles.divider} />

        {/* Summary Stats */}
        <View style={styles.statsSection}>
          <StatRow
            icon="🔢"
            title="Total Rounds"
            value={results.totalRounds.toString()}
            color="#007AFF"
          />

          <StatRow
            icon="✅"
            title="API 200 (Success)"
            value={results.successCount.toString()}
            color="#28a745"
          />

          <StatRow
            icon={results.failureCount > 0 ? '❌' : '✅'}
            title="API Fails"
            value={results.failureCount.toString()}
            color={results.failureCount > 0 ? '#dc3545' : '#28a745'}
          />

          <StatRow
            icon="📊"
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            color={getSuccessRateColor(successRate)}
          />

          <View style={styles.divider} />

          <StatRow
            icon="⏱️"
            title="Average Session Latency"
            value={`${results.averageLatency.toFixed(2)} ms`}
            color={getLatencyColor(results.averageLatency)}
          />

          {minLatency > 0 && (
            <StatRow
              icon="🐇"
              title="Fastest Session"
              value={`${minLatency.toFixed(2)} ms`}
              color="#007AFF"
            />
          )}

          {maxLatency > 0 && (
            <StatRow
              icon="🐢"
              title="Slowest Session"
              value={`${maxLatency.toFixed(2)} ms`}
              color="#007AFF"
            />
          )}
        </View>

        {/* Summary Message */}
        <View style={styles.summaryBox}>
          {results.failureCount === 0 ? (
            <>
              <Text style={styles.summaryTitle}>🎉 All Tests Passed!</Text>
              <Text style={styles.summaryText}>
                No blocking detected. The session management is working
                correctly.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.summaryTitleWarning}>
                ⚠️ Some Tests Failed
              </Text>
              <Text style={styles.summaryText}>
                {results.failureCount} out of {results.totalRounds} requests
                failed.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    width: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  doneButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  testTypeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  resultsLabel: {
    fontSize: 18,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  statsSection: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 20,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  summaryBox: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryTitleWarning: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ResultsView;
