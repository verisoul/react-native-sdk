<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="resources/verisoul-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="resources/verisoul-logo-light.svg">
  <img src="resources/verisoul-logo-light.svg" alt="Verisoul logo" width="312px" style="visibility:visible;max-width:100%;">
</picture>
</p>

# verisoul-reactnative

## Overview

The purpose of this app is to demonstrate Verisoul's Android SDK integration.

_To run the app a Verisoul Project ID is required._ Schedule a call [here](https://meetings.hubspot.com/henry-legard) to
get started.

<!-- <img src="resources/verisoul.gif" width="128"/> -->

## Getting Started

### 1. Add Dependency

#### Using NPM

```sh
npm install @verisoul_ai/react-native-verisoul
```

#### Using Yarn

```sh
yarn add @verisoul_ai/react-native-verisoul
```

### EXPO

The Verisoul SDK is not supported in Expo Go, so if you are using the managed workflow, you will need to use Expo’s
custom development client. If you already have it set up, you can skip to step 3.

1. Open the command line and navigate to your Expo project directory. Then, run the following command to install
   expo-dev-client.
   Node

```sh
npx expo install expo-dev-client
```

2. Modify the scripts section in your package.json file to use expo-dev-client, it should look like this.

```json
"scripts": {
"start": "expo start --dev-client",
"android": "expo run:android",
"ios": "expo run:ios",
...
}
  ```

3. Then install Verisoul SDK

#### Using NPM

```sh
npm install @verisoul_ai/react-native-verisoul
```

#### Using Yarn

```sh
yarn add @verisoul_ai/react-native-verisoul
```

4. If an exception occurs during the build stating that the `ai.verisoul:android` package cannot be downloaded, add the
   following Maven repository inside your `android/build.gradle` file:

```groovy
allprojects {
    repositories {
    // ...

     maven { url = uri("https://us-central1-maven.pkg.dev/verisoul/android") }

    }
 }
```

## Usage

### 1. Initialization

```js
import Verisoul, {
  MotionAction,
  VerisoulEnvironment,
} from '@verisoul_ai/react-native-verisoul';

useEffect(() => {
  Verisoul.configure({
    environment: VerisoulEnvironment.sandbox,
    projectId: 'PROJECT ID',
  });
}, []);
```

When this is called Verisoul library will be initialized, initial data together with **session ID** will be gathered and
uploaded to Verisoul backend.

### 2. Get Session ID

Once the minimum amount of data is gathered the session ID becomes available.
The session ID is needed in order to request a risk assessment from Verisoul's API. Note that session IDs are short
lived and will expire after 24 hours. The application can obtain session ID by providing the callback as shown below:

```js
const sessionData = await Verisoul.getSessionID();
```

### 3. Provide Touch Events

Wrap your App With `VerisoulTouchRootView`
```js

<VerisoulTouchRootView>
  // another Views
</VerisoulTouchRootView>
```
### 4. Reinitialize

Calling `Verisoul.reinitialize()` generates a new `session_id`, which ensures that if a user logs out of one account and into a different account, Verisoul will be able to delineate each account’s data cleanly.
```dart
await Verisoul.reinitialize();
```

## Android

### 1. Provide Touch Events (Android only)

In order to gather touch events and compare them to device accelerometer sensor data, the app will need to provide touch
events to Verisoul. you need to Edit th `MainActivity`, to override `dispatchTouchEvent` function and pass the data to
Verisoul like shown below.

```kotlin
import ai.verisoul.sdk.Verisoul
import android.view.MotionEvent


class MainActivity : ReactActivity() {

  override fun dispatchTouchEvent(event: MotionEvent?): Boolean {
    Verisoul.onTouchEvent(event)
    return super.dispatchTouchEvent(event)
  }

    // Other code...
}
```

## iOS

### Capabilities

To fully utilize VerisoulSDK, you must add the `App Attest` capability to your project. This capability allows the SDK
to perform necessary checks and validations to ensure the integrity and security of your application.

Update your app’s entitlements file:

```
<key>com.apple.developer.devicecheck.appattest-environment</key>
<string>production/development (depending on your needs)</string>
```

## Update the privacy manifest file

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!--
   PrivacyInfo.xcprivacy
   test

   Created by Raine Scott on 1/30/25.
   Copyright (c) 2025 ___ORGANIZATIONNAME___.
   All rights reserved.
-->
<plist version="1.0">
  <dict>
    <!-- Privacy manifest file for Verisoul Fraud Prevention SDK for iOS -->
    <key>NSPrivacyTracking</key>
    <false/>

    <!-- Privacy manifest file for Verisoul Fraud Prevention SDK for iOS -->
    <key>NSPrivacyTrackingDomains</key>
    <array/>

    <!-- Privacy manifest file for Verisoul Fraud Prevention SDK for iOS -->
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
      <dict>
        <!-- The value provided by Apple for 'Device ID' data type -->
        <key>NSPrivacyCollectedDataType</key>
        <string>NSPrivacyCollectedDataTypeDeviceID</string>

        <!-- Verisoul Fraud Prevention SDK does not link the 'Device ID' with user's identity -->
        <key>NSPrivacyCollectedDataTypeLinked</key>
        <false/>

        <!-- Verisoul Fraud Prevention SDK does not use 'Device ID' for tracking -->
        <key>NSPrivacyCollectedDataTypeTracking</key>
        <false/>

        <!-- Verisoul Fraud Prevention SDK uses 'Device ID' for App Functionality
             (prevent fraud and implement security measures) -->
        <key>NSPrivacyCollectedDataTypePurposes</key>
        <array>
          <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
        </array>
      </dict>
    </array>

    <!-- Privacy manifest file for Verisoul Fraud Prevention SDK for iOS -->
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
      <dict>
        <!-- The value provided by Apple for 'System boot time APIs' -->
        <key>NSPrivacyAccessedAPIType</key>
        <string>NSPrivacyAccessedAPICategorySystemBootTime</string>

        <!-- Verisoul Fraud Prevention SDK uses 'System boot time APIs' to measure the amount of
             time that has elapsed between events that occurred within the SDK -->
        <key>NSPrivacyAccessedAPITypeReasons</key>
        <array>
          <string>35F9.1</string>
        </array>
      </dict>
    </array>
  </dict>
</plist>

## Releasing

The release process is fully automated via GitHub Actions. Follow these steps:

### 1. Bump Native Platform Versions

```bash
make bump-android    # Updates Android SDK version
make bump-ios        # Updates iOS SDK version
```

### 2. Bump React Native Package Version

```bash
make release-patch    # 0.4.4 → 0.4.5
make release-minor    # 0.4.4 → 0.5.0
make release-major    # 0.4.4 → 1.0.0
```
**Note:** Publishing uses OIDC authentication (no manual secrets required).

## Questions and Feedback

Comprehensive documentation about Verisoul's Android SDK and API can be found
at [docs.verisoul.ai](https://docs.verisoul.ai/). Additionally, reach out to Verisoul
at [help@verisoul.ai](mailto:help@verisoul.ai) for any questions or feedback.
