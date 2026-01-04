const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Prefer the SDK's source (`package.json#source`) during local development.
// This ensures edits in ../src are reflected without running a build step.
config.resolver.resolverMainFields = [
  'source',
  'react-native',
  'browser',
  'main',
];

const findSdkPath = () => {
  // Use workspace root (for development/local setup)
  if (fs.existsSync(path.join(workspaceRoot, 'src', 'index.tsx'))) {
    return workspaceRoot;
  }

  // try node_modules (for published package)
  const nodeModulesPath = path.resolve(
    projectRoot,
    'node_modules',
    '@verisoul_ai',
    'react-native-verisoul'
  );
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
  }

  return workspaceRoot;
};

// Watch the parent workspace for changes to the SDK
config.watchFolders = [workspaceRoot];

// IMPORTANT: Always resolve React/React Native/Expo from the app's own
// `node_modules` to avoid version skew between JS bundle and native runtime.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

// Point to the detected SDK path
config.resolver.extraNodeModules = {
  // Force singletons from the app
  'react': path.resolve(projectRoot, 'node_modules', 'react'),
  'react-native': path.resolve(projectRoot, 'node_modules', 'react-native'),
  'expo': path.resolve(projectRoot, 'node_modules', 'expo'),
  '@verisoul_ai/react-native-verisoul': findSdkPath(),
  'verisoul-reactnative': findSdkPath(),
};

module.exports = config;
