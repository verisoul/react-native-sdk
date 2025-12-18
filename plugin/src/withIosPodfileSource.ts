import type { ConfigPlugin } from '@expo/config-plugins';
import { withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const VERISOUL_GITHUB_SOURCE =
  "source 'https://github.com/verisoul/ios-sdk.git'";
const COCOAPODS_CDN_SOURCE = "source 'https://cdn.cocoapods.org/'";

/**
 * Adds Verisoul iOS SDK source to the Podfile
 */
export const withIosPodfileSource: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const podfilePath = path.join(
        modConfig.modRequest.platformProjectRoot,
        'Podfile'
      );

      if (!fs.existsSync(podfilePath)) {
        return modConfig;
      }

      let content = fs.readFileSync(podfilePath, 'utf8');

      if (content.includes('github.com/verisoul/ios-sdk.git')) {
        return modConfig;
      }

      const requirePattern = /^(require\s+.+$)/m;
      if (requirePattern.test(content)) {
        content = content.replace(
          requirePattern,
          `$1\n\n${VERISOUL_GITHUB_SOURCE}\n${COCOAPODS_CDN_SOURCE}`
        );
      } else {
        content = `${VERISOUL_GITHUB_SOURCE}\n${COCOAPODS_CDN_SOURCE}\n\n${content}`;
      }

      fs.writeFileSync(podfilePath, content, 'utf8');
      return modConfig;
    },
  ]);
};
