const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the parent workspace for changes to the SDK
config.watchFolders = [workspaceRoot];

// Resolve packages from both project and workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Point to the local SDK
config.resolver.extraNodeModules = {
  '@verisoul_ai/react-native-verisoul': workspaceRoot,
};

module.exports = config;
