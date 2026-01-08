import type { ConfigContext, ExpoConfig } from 'expo/config';

// Loads .env into process.env for config-time evaluation.
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    // Ensure required ExpoConfig fields are always present for type-safety.
    name: config.name ?? 'Verisoul Expo Example',
    slug: config.slug ?? 'verisoul-expo-example',
    extra: {
      ...(config.extra ?? {}),
      VERISOUL_ENV: process.env.VERISOUL_ENV ?? 'dev',
      VERISOUL_PROJECT_ID:
        process.env.VERISOUL_PROJECT_ID ??
        '00000000-0000-0000-0000-000000000001',
      VERISOUL_API_KEY: process.env.VERISOUL_API_KEY ?? '',
    },
  };
};
