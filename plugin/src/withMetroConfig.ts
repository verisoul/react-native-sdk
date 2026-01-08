import type { ConfigPlugin } from '@expo/config-plugins';
import { withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automatically configures metro.config.js to properly resolve the Verisoul SDK
 * Handles different project setups: monorepo, development, and published package
 */
export const withMetroConfig: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const metroConfigPath = path.join(projectRoot, 'metro.config.js');

      // Check if metro.config.js already exists and has our configuration
      if (fs.existsSync(metroConfigPath)) {
        const content = fs.readFileSync(metroConfigPath, 'utf8');
        if (
          content.includes('@verisoul_ai/react-native-verisoul') &&
          content.includes('findSdkPath')
        ) {
          // Already configured
          return modConfig;
        }
      }

      // Create or update metro.config.js with Verisoul SDK configuration
      const metroConfig = generateMetroConfig();
      fs.writeFileSync(metroConfigPath, metroConfig, 'utf8');

      return modConfig;
    },
  ]);
};

/**
 * Generates the complete metro.config.js content with SDK path resolution
 */
function generateMetroConfig(): string {
  return `const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Function to automatically detect SDK path
const findSdkPath = () => {
  // First try to find the built SDK in the parent directory (monorepo setup)
  const libPath = path.resolve(workspaceRoot, 'lib');
  if (fs.existsSync(libPath) && fs.existsSync(path.join(libPath, 'index.js'))) {
    return libPath;
  }

  // Fall back to workspace root (for development/local setup)
  if (fs.existsSync(path.join(workspaceRoot, 'src', 'index.tsx'))) {
    return workspaceRoot;
  }

  // Last resort: try node_modules (for published package)
  const nodeModulesPath = path.resolve(
    projectRoot,
    'node_modules',
    '@verisoul_ai',
    'react-native-verisoul'
  );
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
  }

  // Default to workspace root if nothing else works
  return workspaceRoot;
};

// Watch the parent workspace for changes to the SDK
config.watchFolders = [workspaceRoot];

// Resolve packages from both project and workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Point to the automatically detected SDK path
config.resolver.extraNodeModules = {
  '@verisoul_ai/react-native-verisoul': findSdkPath(),
};

module.exports = config;
`;
}
