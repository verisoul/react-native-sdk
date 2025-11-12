import Verisoul from '@verisoul_ai/react-native-verisoul';

export interface TestResults {
  successCount: number;
  failureCount: number;
  sessionLatencies: number[];
  averageLatency: number;
  totalRounds: number;
}

class ResultsTracker {
  private successCount = 0;
  private failureCount = 0;
  private sessionLatencies: number[] = [];

  recordSuccess(latency: number): void {
    this.successCount += 1;
    this.sessionLatencies.push(latency);
  }

  recordFailure(latency: number): void {
    this.failureCount += 1;
    this.sessionLatencies.push(latency);
  }

  getResults(): TestResults {
    const averageLatency =
      this.sessionLatencies.length > 0
        ? this.sessionLatencies.reduce((a, b) => a + b, 0) /
          this.sessionLatencies.length
        : 0;

    return {
      successCount: this.successCount,
      failureCount: this.failureCount,
      sessionLatencies: [...this.sessionLatencies],
      averageLatency,
      totalRounds: this.successCount + this.failureCount,
    };
  }
}

// Helper to get current timestamp in milliseconds
const now = (): number => Date.now();

// Get session ID
const get = async (): Promise<string> => {
  return await Verisoul.getSessionID();
};

// Reinitialize and get session ID
const reinitAndGet = async (): Promise<string> => {
  await Verisoul.reinitialize();
  return await get();
};

// Call authenticate API
const callAuthenticate = async (sid: string): Promise<boolean> => {
  try {
    const response = await fetch(
      'https://api.dev.verisoul.ai/session/authenticate',
      {
        method: 'POST',
        headers: {
          'x-api-key': '<API_KEY>',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: { id: `test-${sid}` },
          session_id: sid,
        }),
      }
    );
    return response.status === 200;
  } catch (error) {
    return false; // network / TLS failure counts as "FAIL"
  }
};

// Sleep utility
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Run a single repeat test round
const runRepeatRound = async (
  round: number,
  reinitMultiple: number,
  tracker: ResultsTracker
): Promise<void> => {
  const startTime = now();

  try {
    const shouldReinit =
      reinitMultiple > 0 && round > 0 && round % reinitMultiple === 0;
    const sid = shouldReinit ? await reinitAndGet() : await get();

    const sessionLatency = now() - startTime;

    const ok = await callAuthenticate(sid);
    console.log(
      `[${round}] sid=${sid}  api=${ok ? '200' : 'FAIL'}  latency=${sessionLatency.toFixed(2)}ms`
    );

    if (ok) {
      tracker.recordSuccess(sessionLatency);
    } else {
      tracker.recordFailure(sessionLatency);
    }
  } catch (error) {
    const sessionLatency = now() - startTime;
    console.log(
      `[${round}] exception → ${error}  latency=${sessionLatency.toFixed(2)}ms`
    );
    tracker.recordFailure(sessionLatency);
  }
};

/**
 * Run repeat test
 * @param times Number of rounds to run
 * @param reinitMultiple Reinitialize every N rounds
 * @param parallel If true, run all requests in parallel; if false, run sequentially
 */
export const runRepeatTest = async (
  times: number,
  reinitMultiple: number = 3,
  parallel: boolean = false
): Promise<TestResults> => {
  const tracker = new ResultsTracker();

  if (parallel) {
    // Fire-and-forget mode: launch all requests without awaiting
    const promises = [];
    for (let i = 0; i < times; i++) {
      promises.push(runRepeatRound(i, reinitMultiple, tracker));
    }
    await Promise.all(promises);
  } else {
    // Sequential mode: await each request before starting the next
    for (let i = 0; i < times; i++) {
      await runRepeatRound(i, reinitMultiple, tracker);
    }
  }

  return tracker.getResults();
};

// Run a single chaos test round
const runChaosRound = async (
  round: number,
  delayRange: [number, number],
  tracker: ResultsTracker
): Promise<void> => {
  const startTime = now();

  try {
    const sid = Math.random() > 0.5 ? await reinitAndGet() : await get();

    const sessionLatency = now() - startTime;

    // Add jitter to increase overlap
    const sleepMS =
      Math.floor(Math.random() * (delayRange[1] - delayRange[0] + 1)) +
      delayRange[0];
    await sleep(sleepMS);

    const ok = await callAuthenticate(sid);
    console.log(
      `[${round.toString().padStart(2, '0')}] sid=${sid}  api=${ok ? '200' : 'FAIL'}  latency=${sessionLatency.toFixed(2)}ms`
    );

    if (ok) {
      tracker.recordSuccess(sessionLatency);
    } else {
      tracker.recordFailure(sessionLatency);
    }
  } catch (error) {
    const sessionLatency = now() - startTime;
    console.log(
      `[${round.toString().padStart(2, '0')}] exception → ${error}  latency=${sessionLatency.toFixed(2)}ms`
    );
    tracker.recordFailure(sessionLatency);
  }
};

/**
 * Run chaos test with concurrent workers
 * @param rounds Total number of rounds
 * @param concurrency Number of concurrent workers
 * @param randomDelay Delay range in milliseconds [min, max]
 */
export const runChaosTest = async (
  rounds: number = 40,
  concurrency: number = 8,
  randomDelay: [number, number] = [200, 900]
): Promise<TestResults> => {
  const tracker = new ResultsTracker();

  // Launch N workers; each worker handles every N-th round
  const workers = [];
  for (let workerIdx = 0; workerIdx < concurrency; workerIdx++) {
    const worker = (async () => {
      let round = workerIdx;
      while (round < rounds) {
        await runChaosRound(round, randomDelay, tracker);
        round += concurrency;
      }
    })();
    workers.push(worker);
  }

  await Promise.all(workers);

  const results = tracker.getResults();
  console.log(
    `Finished ${rounds} rounds – ${results.failureCount} failures, avg latency: ${results.averageLatency.toFixed(2)}ms`
  );

  return results;
};
