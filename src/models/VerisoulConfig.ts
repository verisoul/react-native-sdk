import type { VerisoulEnvironment } from '../utils/Enums';

export interface VerisoulConfig {
  /**
   * The project ID to be used in networking requests.
   */
  projectId: string;
  /**
   * The environment to configure the SDK with (e.g., dev, staging, prod).
   */
  environment: VerisoulEnvironment;
}
