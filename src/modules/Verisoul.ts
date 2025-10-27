import type { VerisoulConfig } from 'verisoul-reactnative';
import { MotionAction, VerisoulEnvironment } from '../utils/Enums';
import { NativeVerisoul } from '../native/NativeVerisoul';
import { Platform } from 'react-native';

// In-memory cache for session ID (valid for 24 hours)
let cachedSessionId: string | null = null;
// Promise deduplication for concurrent calls
let sessionPromise: Promise<string> | null = null;

/**
 * Retrieves current session's id.
 * Uses in memory cache to avoid unnecessary native calls.
 * Deduplicates concurrent calls to prevent race conditions.
 *
 * @example
 * ```ts
 * Verisoul.getSessionID();
 * ```
 */
export const getSessionID = async (): Promise<string> => {
  if (cachedSessionId) {
    return cachedSessionId;
  }

  if (sessionPromise) {
    return sessionPromise;
  }

  sessionPromise = NativeVerisoul.getSessionId();
  try {
    cachedSessionId = await sessionPromise;
    return cachedSessionId;
  } finally {
    sessionPromise = null;
  }
};

/**
 * Creates a new session ID.
 *
 * @example
 * ```ts
 * Verisoul.reinitialize();
 * ```
 */
export const reinitialize = async (): Promise<void> => {
  cachedSessionId = null;
  sessionPromise = null;
  return NativeVerisoul.reinitialize();
};

/**
 * Configures the SDK with the provided environment, project ID, and bundle identifier.
 * Initializes networking, device check, and device attestation components.
 *
 * @param config SDK configurations. See {@link VerisoulConfig} for more info.
 */
export const configure = async (config: VerisoulConfig): Promise<void> => {
  return NativeVerisoul.configure(
    config.environment ?? VerisoulEnvironment.dev,
    config.projectId
  );
};

/**
 * report actions are used to handle gesture events in a pan responder.
 *
 * @param x the location of touch event in X axis
 * @param y the location of touch event in Y axis
 * @param action SDK configurations. See {@link MotionAction} for more info.
 */
export const onTouchEvent = async (
  x: number,
  y: number,
  action: MotionAction
): Promise<void> => {
  if (Platform.OS === 'ios') {
    return;
  }
  return NativeVerisoul.onActionEvent(x, y, action);
};
