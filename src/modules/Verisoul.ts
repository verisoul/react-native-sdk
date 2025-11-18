import type { VerisoulConfig } from 'verisoul-reactnative';
import { MotionAction, VerisoulEnvironment } from '../utils/Enums';
import { NativeVerisoul } from '../native/NativeVerisoul';
import { Platform } from 'react-native';

/**
 * Retrieves current session's id.
 *
 * @example
 * ```ts
 * Verisoul.getSessionID();
 * ```
 */
export const getSessionID = async (): Promise<string> => {
  return NativeVerisoul.getSessionId();
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
  return NativeVerisoul.reinitialize();
};

/**
 * Configures the SDK with the provided environment, project ID, and bundle identifier.
 * Initializes networking, device check, and device attestation components.
 *
 * @param config SDK configurations. See {@link VerisoulConfig} for more info.
 */
export const configure = async (config: VerisoulConfig): Promise<void> => {
  return await NativeVerisoul.configure(
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
