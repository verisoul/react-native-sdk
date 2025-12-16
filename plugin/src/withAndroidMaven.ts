import type { ConfigPlugin } from '@expo/config-plugins';
import { withProjectBuildGradle } from '@expo/config-plugins';

const VERISOUL_MAVEN_REPO =
  'https://us-central1-maven.pkg.dev/verisoul/android';
const MAVEN_DECLARATION = `        maven { url '${VERISOUL_MAVEN_REPO}' }`;

/**
 * Adds Verisoul Maven repository to Android project build.gradle
 */
export const withAndroidMaven: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (modConfig) => {
    const buildGradle = modConfig.modResults.contents;

    if (buildGradle.includes(VERISOUL_MAVEN_REPO)) {
      return modConfig;
    }

    const repositoriesPattern = /(allprojects\s*\{\s*repositories\s*\{)/;
    if (repositoriesPattern.test(buildGradle)) {
      modConfig.modResults.contents = buildGradle.replace(
        repositoriesPattern,
        `$1\n${MAVEN_DECLARATION}`
      );
    }

    return modConfig;
  });
};
