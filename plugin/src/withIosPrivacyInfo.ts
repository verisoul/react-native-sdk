import type { ConfigPlugin } from '@expo/config-plugins';
import { withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automatically configures PrivacyInfo.xcprivacy with required declarations:
 * 1. NSPrivacyCollectedDataTypeDeviceID - Device identifier collection
 * 2. NSPrivacyAccessedAPICategorySystemBootTime - System boot time API access
 */
export const withIosPrivacyInfo: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const privacyPath = path.join(
        modConfig.modRequest.platformProjectRoot,
        modConfig.modRequest.projectName || 'App',
        'PrivacyInfo.xcprivacy'
      );

      if (!fs.existsSync(privacyPath)) {
        const privacyDir = path.dirname(privacyPath);
        if (!fs.existsSync(privacyDir)) {
          fs.mkdirSync(privacyDir, { recursive: true });
        }
        fs.writeFileSync(privacyPath, createCompleteManifest(), 'utf8');
        return modConfig;
      }

      let content = fs.readFileSync(privacyPath, 'utf8');
      let modified = false;

      if (!content.includes('NSPrivacyCollectedDataTypeDeviceID')) {
        content = addToArray(
          content,
          'NSPrivacyCollectedDataTypes',
          getDeviceIDDict()
        );
        modified = true;
      }

      if (!content.includes('NSPrivacyAccessedAPICategorySystemBootTime')) {
        content = addToArray(
          content,
          'NSPrivacyAccessedAPITypes',
          getSystemBootTimeDict()
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(privacyPath, content, 'utf8');
      }

      return modConfig;
    },
  ]);
};

/**
 * Creates a complete privacy manifest with all required declarations
 */
function createCompleteManifest(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>NSPrivacyAccessedAPITypes</key>
\t<array>
${getSystemBootTimeDict()}
\t</array>
\t<key>NSPrivacyCollectedDataTypes</key>
\t<array>
${getDeviceIDDict()}
\t</array>
\t<key>NSPrivacyTracking</key>
\t<false/>
</dict>
</plist>
`;
}

/**
 * Returns Device ID dictionary XML
 */
function getDeviceIDDict(): string {
  return `\t\t<dict>
\t\t\t<key>NSPrivacyCollectedDataType</key>
\t\t\t<string>NSPrivacyCollectedDataTypeDeviceID</string>
\t\t\t<key>NSPrivacyCollectedDataTypeLinked</key>
\t\t\t<false/>
\t\t\t<key>NSPrivacyCollectedDataTypeTracking</key>
\t\t\t<false/>
\t\t\t<key>NSPrivacyCollectedDataTypePurposes</key>
\t\t\t<array>
\t\t\t\t<string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
\t\t\t\t<string>NSPrivacyCollectedDataTypePurposeFraudPreventionAndSecurity</string>
\t\t\t</array>
\t\t</dict>`;
}

/**
 * Returns SystemBootTime API dictionary XML
 */
function getSystemBootTimeDict(): string {
  return `\t\t<dict>
\t\t\t<key>NSPrivacyAccessedAPIType</key>
\t\t\t<string>NSPrivacyAccessedAPICategorySystemBootTime</string>
\t\t\t<key>NSPrivacyAccessedAPITypeReasons</key>
\t\t\t<array>
\t\t\t\t<string>35F9.1</string>
\t\t\t</array>
\t\t</dict>`;
}

/**
 * Adds a dictionary to plist array, creating the array if needed
 */
function addToArray(
  content: string,
  arrayKey: string,
  dictContent: string
): string {
  // Try to add to existing array
  const arrayPattern = new RegExp(`(<key>${arrayKey}</key>\\s*<array>)`, 'm');
  if (arrayPattern.test(content)) {
    return content.replace(arrayPattern, `$1\n${dictContent}`);
  }

  // Create new array before closing dict
  const closingDict = /(<\/dict>\s*<\/plist>)/;
  return content.replace(
    closingDict,
    `\t<key>${arrayKey}</key>\n\t<array>\n${dictContent}\n\t</array>\n$1`
  );
}
