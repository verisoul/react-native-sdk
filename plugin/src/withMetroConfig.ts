import type { ConfigPlugin } from '@expo/config-plugins';
import { withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automatically creates metro.config.js with SDK resolution logic
 */
export const withMetroConfig: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    (modConfig) => {
      const metroConfigPath = path.join(
        modConfig.modRequest.projectRoot,
        'metro.config.js'
      );

      if (!fs.existsSync(metroConfigPath)) {
        const metroConfigContent = `const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

const findSdkPath = () => {
  // find the built SDK in the parent directory (monorepo setup)
  const libPath = path.resolve(workspaceRoot, 'lib');
  if (fs.existsSync(libPath) && fs.existsSync(path.join(libPath, 'index.js'))) {
    return libPath;
  }

  // fall back to workspace root (for development/local setup)
  if (fs.existsSync(path.join(workspaceRoot, 'src', 'index.tsx'))) {
    return workspaceRoot;
  }

  // try node_modules (for published package)
  const nodeModulesPath = path.resolve(projectRoot, 'node_modules', '@verisoul_ai', 'react-native-verisoul');
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
  }

  return workspaceRoot;
};

// Watch the parent workspace for changes to the SDK
config.watchFolders = [workspaceRoot];

// Resolve packages from both project and workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Point to the detected SDK path
config.resolver.extraNodeModules = {
  '@verisoul_ai/react-native-verisoul': findSdkPath(),
};

module.exports = config;
`;

        fs.writeFileSync(metroConfigPath, metroConfigContent);
        console.log('✅ Created metro.config.js with automatic SDK resolution');
      }

      return modConfig;
    },
  ]);
};
