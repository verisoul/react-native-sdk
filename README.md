<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="resources/verisoul-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="resources/verisoul-logo-light.svg">
  <img src="resources/verisoul-logo-light.svg" alt="Verisoul logo" width="312px" style="visibility:visible;max-width:100%;">
</picture>
</p>

# React Native SDK

Verisoul provides a React Native SDK that allows you to implement fraud prevention in your cross-platform mobile applications. This guide covers the installation, configuration, and usage of the Verisoul React Native SDK.

_To run the SDK a Verisoul Project ID is required._ Schedule a call [here](https://meetings.hubspot.com/henry-legard) to get started.

## System Requirements

- React Native 0.60 or higher
- iOS 14.0 or higher
- Android API level 21 (Android 5.0) or higher
- For Expo projects: Expo SDK 45 or higher with custom development client

## Installation

#### Using NPM

```sh
npm install @verisoul_ai/react-native-verisoul
```

#### Using Yarn

```sh
yarn add @verisoul_ai/react-native-verisoul
```

#### Android Configuration

If an exception occurs during the build stating that the `ai.verisoul:android` package cannot be downloaded, add the following Maven repository inside your `android/build.gradle` file:

```groovy
allprojects {
    repositories {
        // ...
        maven { url = uri("https://us-central1-maven.pkg.dev/verisoul/android") }
    }
}
```

### Expo Projects

The Verisoul SDK is not supported in Expo Go. If you are using the managed workflow, you will need to use Expo's custom development client.

1. Install expo-dev-client:

```sh
npx expo install expo-dev-client
```

2. Modify the scripts section in your `package.json` file:

```json
"scripts": {
  "start": "expo start --dev-client",
  "android": "expo run:android",
  "ios": "expo run:ios"
}
```

3. Install Verisoul SDK:

```sh
npm install @verisoul_ai/react-native-verisoul
```

4. If needed, add the Maven repository to your `android/build.gradle` file as shown in the Android Configuration section above.

## Usage

### Initialize the SDK

The `configure()` method initializes the Verisoul SDK with your project credentials. This method must be called once when your application starts.

**Parameters:**

- `environment`: The environment to use `VerisoulEnvironment.prod` for production or `VerisoulEnvironment.sandbox` for testing
- `projectId`: Your unique Verisoul project identifier

**Example:**

```js
import Verisoul, {
  VerisoulEnvironment,
} from "@verisoul_ai/react-native-verisoul";

useEffect(() => {
  Verisoul.configure({
    environment: VerisoulEnvironment.prod, // or VerisoulEnvironment.sandbox
    projectId: "YOUR_PROJECT_ID",
  });
}, []);
```

When called, the Verisoul SDK will initialize its components, begin collecting device telemetry data, and prepare a session ID for fraud assessment.

### getSessionId()

The `getSessionID()` method returns the current session identifier after the SDK has collected sufficient device data. This session ID is required to request a risk assessment from Verisoul's API.

**Important Notes:**

- Session IDs are short-lived and expire after 24 hours
- The session ID becomes available once minimum data collection is complete (typically within seconds)
- You should send this session ID to your backend, which can then call Verisoul's API to get a risk assessment
- A new session ID is generated each time the SDK is initialized or when `reinitialize()` is called

**Example:**

```js
const sessionId = await Verisoul.getSessionID();
```

### reinitialize()

The `reinitialize()` method generates a fresh session ID and resets the SDK's data collection. This is essential for maintaining data integrity when user context changes.

**Example:**

```js
await Verisoul.reinitialize();
```

After calling this method, you can call `getSessionID()` to retrieve the new session identifier.

### Provide Touch Events

Touch event data is collected and analyzed to detect automated/bot behavior by comparing touch patterns with device sensor data. This helps identify anomalies that may indicate fraud.

**React Native Setup:**

Wrap your root component with `VerisoulTouchRootView` to automatically capture touch events across both iOS and Android:

```js
import { VerisoulTouchRootView } from "@verisoul_ai/react-native-verisoul";

function App() {
  return (
    <VerisoulTouchRootView>{/* Your app components */}</VerisoulTouchRootView>
  );
}
```

#### iOS Configuration

For iOS-specific configuration including Device Check and App Attest setup, please refer to the [iOS SDK Documentation](/integration/frontend/ios#ios-device-check).

### Error Codes

The SDK throws `VerisoulException` with the following error codes:

| Error Code | Value | Description | Recommended Action |
|------------|-------|-------------|-------------------|
| INVALID_ENVIRONMENT | "INVALID_ENVIRONMENT" | The environment parameter passed to init() is invalid. Valid values are "dev", "sandbox", or "prod". | Integration Error. This is a developer configuration issue, not a user error. Verify that the environment string passed to Verisoul.init() is exactly one of: dev, sandbox, or prod. Environment values are case-sensitive. Check for typos, extra whitespace, or incorrect values like "production" or "DEV". |
| SESSION_UNAVAILABLE | "SESSION_UNAVAILABLE" | A valid session ID could not be obtained. This typically occurs when Verisoul's servers are unreachable due to network blocking or a very slow connection. | Retry with backoff. Verisoul may be blocked by a firewall, VPN, or the user has poor connectivity. Implement retry logic with exponential backoff. If the error persists, prompt the user to check their network connection or try disabling VPN/proxy settings. Consider logging this for debugging network issues in specific regions or networks. |
| WEBVIEW_UNAVAILABLE | "WEBVIEW_UNAVAILABLE" | WebView is not available on the device. This can occur when WebView is disabled, missing, uninstalled, or corrupted on the device. | Prompt user action. This error is not retried by the SDK since WebView availability won't change during the session. Recommend prompting the user to: (1) Use a device that supports WebViews, (2) Enable WebView if it has been disabled in device settings, or (3) Update Android System WebView from the Play Store if it's outdated or corrupted. |

#### Detailed Error Code Documentation

**INVALID_ENVIRONMENT**

Type: Integration Error (Developer)

When it occurs:
- Passing an invalid string to `VerisoulEnvironment.fromValue()` or equivalent
- Environment value not matching exactly: `dev`, `sandbox`, or `prod`
- Case sensitivity issues (e.g., "DEV" instead of "dev")
- Extra whitespace (e.g., " dev ")
- Typos (e.g., "production" instead of "prod")

SDK Behavior:
- Exception thrown immediately during initialization
- No retries attempted

Developer Action:

```js
// ✅ Correct
Verisoul.configure({
  environment: VerisoulEnvironment.prod,
  projectId: "your-project-id",
});

// ❌ Incorrect - will throw INVALID_ENVIRONMENT
// Using incorrect environment strings or values
```

**SESSION_UNAVAILABLE**

Type: Runtime Error (Network/Connectivity)

When it occurs:
- Network timeout waiting for session
- Verisoul servers unreachable
- Network blocking (firewall, corporate proxy, VPN)
- Very slow network connection
- All retry attempts exhausted

SDK Behavior:
- SDK automatically retries up to 4 times with delays
- WebView initialization retries up to 3 times
- Error thrown only after all retries are exhausted

Developer Action:

```js
try {
  const sessionId = await Verisoul.getSessionID();
  // Use sessionId
} catch (error) {
  if (error.code === VerisoulErrorCodes.SESSION_UNAVAILABLE) {
    // Implement retry with backoff or prompt user about connectivity
  }
}
```

**WEBVIEW_UNAVAILABLE**

Type: Device Limitation Error

When it occurs:
- WebView is disabled on the device
- WebView component is missing or uninstalled
- WebView is corrupted or incompatible
- Device doesn't support WebView (rare, older/custom ROMs)

SDK Behavior:
- No retries - fails immediately
- This is intentional since WebView availability won't change during the app session

Developer Action:

```js
try {
  const sessionId = await Verisoul.getSessionID();
  // Use sessionId
} catch (error) {
  if (error.code === VerisoulErrorCodes.WEBVIEW_UNAVAILABLE) {
    // Show user-friendly message:
    // "Please enable WebView in your device settings or
    //  update Android System WebView from the Play Store"
  }
}
```

#### Exception Structure

All errors are thrown as `VerisoulException` with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| code | String | One of the error codes above |
| message | String | Human-readable error description |
| cause | Throwable? | The underlying exception that caused the error (if any) |

## Example
For a complete working example, see the [example folder](https://github.com/verisoul/react-native-sdk/tree/main/example) in this repository.

## Additional Resources
- [Verisoul NPM](https://www.npmjs.com/package/@verisoul_ai/react-native-verisoul)
