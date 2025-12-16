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

> **Note:** Requires custom development client (not supported in Expo Go)

**1. Install expo-dev-client:**

```sh
npx expo install expo-dev-client
```

**2. Add plugin to `app.json`:**

```json
{
  "expo": {
    "plugins": ["@verisoul_ai/react-native-verisoul"]
  }
}
```

**3. Install Verisoul SDK:**

```sh
npm install @verisoul_ai/react-native-verisoul
```

**4. Prebuild and run:**

```sh
npx expo prebuild --clean
npx expo run:android  # or npx expo run:ios
```

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
} from '@verisoul_ai/react-native-verisoul';

useEffect(() => {
  Verisoul.configure({
    environment: VerisoulEnvironment.prod, // or VerisoulEnvironment.sandbox
    projectId: 'YOUR_PROJECT_ID',
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
import { VerisoulTouchRootView } from '@verisoul_ai/react-native-verisoul';

function App() {
  return (
    <VerisoulTouchRootView>{/* Your app components */}</VerisoulTouchRootView>
  );
}
```

#### iOS Configuration

For iOS-specific configuration including Device Check and App Attest setup, please refer to the [iOS SDK Documentation](/integration/frontend/ios#ios-device-check).

## Example

For a complete working example, see the [example folder](https://github.com/verisoul/react-native-sdk/tree/main/example) in this repository.

## Additional Resources

- [Verisoul NPM](https://www.npmjs.com/package/@verisoul_ai/react-native-verisoul)
