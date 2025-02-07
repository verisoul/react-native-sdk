import type { VerisoulConfig } from '../models/VerisoulConfig';
import { VerisoulEnvironment } from '../utils/Enums';
import { NativeVerisoul } from '../native/NativeVerisoul';

/**
 * Retrieves current session's replay link.
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
