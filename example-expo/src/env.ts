import Constants from 'expo-constants';

type Extra = {
  VERISOUL_ENV?: string;
  VERISOUL_PROJECT_ID?: string;
  VERISOUL_API_KEY?: string;
};

// Prefer Expo config `extra` (populated via app.config.ts). Fallback to process.env for dev.
const extra: Extra =
  (Constants.expoConfig?.extra as Extra | undefined) ??
  ((Constants.manifest as any)?.extra as Extra | undefined) ??
  {};

export const VERISOUL_ENV: string =
  extra.VERISOUL_ENV ??
  (process.env.VERISOUL_ENV as string | undefined) ??
  'dev';

export const VERISOUL_PROJECT_ID: string =
  extra.VERISOUL_PROJECT_ID ??
  (process.env.VERISOUL_PROJECT_ID as string | undefined) ??
  '00000000-0000-0000-0000-000000000001';

export const VERISOUL_API_KEY: string =
  extra.VERISOUL_API_KEY ??
  (process.env.VERISOUL_API_KEY as string | undefined) ??
  '';
