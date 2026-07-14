## [0.4.73] - 2026-07-14

### Changed
- **Android**: bump `ai.verisoul:android` to **0.4.71** — recovers from a corrupted DataStore preferences file ("Unable to parse preferences proto") that previously made `getSessionId()` fail permanently with `SESSION_UNAVAILABLE` on affected devices until app storage was cleared

## [0.4.72] - 2026-07-14

### Changed
- **Docs**: recommend calling `configure()` before you intend to retrieve a session_id — only initialize the SDK if you plan to call the Verisoul API for that session

## [0.4.71] - 2026-07-07

### Changed
- **iOS**: bump `VerisoulSDK` to **0.4.70** — fixes a crash in React Native New Architecture (Fabric) apps where the SDK's touch-capture overlay cleanup could remove a React-managed view (tag collision), corrupting Fabric's mounting state and crashing with `NSRangeException` in `unmountChildComponentView` during view teardown

## [0.4.70] - 2026-07-06

### Fixed
- **Expo plugin**: no longer generates or overwrites the app's `metro.config.js` during `expo prebuild`. The published package resolves from `node_modules` without any Metro configuration, and the previous behavior destroyed customer Metro customizations (transformers, resolver options, wrappers) on every prebuild.

## [0.4.69] - 2026-06-26

### Changed
- **Android**: bump `ai.verisoul:android` to **0.4.70** (clear cached session on project/environment change)
- **iOS**: bump `VerisoulSDK` to **0.4.69**

## [0.4.68] - 2026-06-25

### Changed
- **Android**: bump `ai.verisoul:android` to **0.4.69** (env-specific WebView host + JS bridge validation)
- **iOS**: bump `VerisoulSDK` to **0.4.68** (env-specific WebView host)

## [0.4.65] - 2026-01-23

### Changed
- **Android**: bump `ai.verisoul:android` to **0.4.66**
- **iOS**: add `WEBVIEW_RENDERER_CRASHED` error code
- **TypeScript**: add `WEBVIEW_RENDERER_CRASHED` error code

## [0.4.64] - 2026-01-08

### Changed
- **iOS**: bump `VerisoulSDK` to **0.4.64**
- **Android**: bump `ai.verisoul:android` to **0.4.65**
- **Example**: fix Android example monorepo module resolution (`:verisoul_ai_react-native-verisoul`) to ensure `example` builds locally


