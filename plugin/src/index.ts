import type { ConfigPlugin } from '@expo/config-plugins';
import { createRunOncePlugin } from '@expo/config-plugins';
import { withAndroidMaven } from './withAndroidMaven';
import { withIosPodfileSource } from './withIosPodfileSource';
import { withIosPrivacyInfo } from './withIosPrivacyInfo';
import { withMetroConfig } from './withMetroConfig';

const pkg = require('../../package.json');

/**
 * Automates native configurations:
 * - Android: Adds Verisoul Maven repository to build.gradle
 * - iOS: Adds Verisoul iOS SDK source to Podfile
 * - iOS: Configures privacy manifest for Device ID collection
 * - Metro: Creates metro.config.js with automatic SDK resolution
 */
const withVerisoul: ConfigPlugin = (config) => {
  config = withAndroidMaven(config);
  config = withIosPodfileSource(config);
  config = withIosPrivacyInfo(config);
  config = withMetroConfig(config);

  return config;
};

export default createRunOncePlugin(withVerisoul, pkg.name, pkg.version);
