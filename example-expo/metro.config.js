const { getDefaultConfig } = require('expo/metro-config');
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
  // Expo doesn't reliably apply the react-native-dotenv transform early enough for Metro
  // dependency extraction, so provide a real module for '@env' as well.
  '@env': path.resolve(projectRoot, 'src/env.ts'),
};

module.exports = config;
