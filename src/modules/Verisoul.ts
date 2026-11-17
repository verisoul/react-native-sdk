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
    config.projectId,
    config.customHostname ?? null
  );
};

/**
 * report actions are used to handle gesture events in a pan responder.
 *
 * @param x the screen position of the touch event on the X axis, in density-independent pixels
 * @param y the screen position of the touch event on the Y axis, in density-independent pixels
 * @param action the type of motion. See {@link MotionAction} for more info.
 *   On Android only `ACTION_DOWN` is recorded. Other actions are accepted and ignored.
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
