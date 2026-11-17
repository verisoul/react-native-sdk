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
  /**
   * Optional. A custom hostname set up for your Verisoul project (for example
   * "js.example.com"). When set, the SDK loads from this hostname and does not
   * fall back to the Verisoul host. Pass the hostname only, with no scheme,
   * port or path.
   */
  customHostname?: string;
}
