# Verisoul React Native Sample App

This example app demonstrates how to integrate the Verisoul SDK into a React Native application.

## Requirements

- React Native development environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))
- Node.js and npm or Yarn
- **iOS**: Xcode and CocoaPods
- **Android**: Android Studio and Android SDK

## Configure

Before running the sample app, you need to configure it with your Verisoul credentials.

1. Copy the example environment file to create your own `.env` file:

```sh
cp .env.example .env
```

2. Open `.env` and fill in your Verisoul credentials:

```sh
# Environment: sandbox or production
VERISOUL_ENV=sandbox

# Your Verisoul project ID
VERISOUL_PROJECT_ID=your-project-id-here

# Your Verisoul API key (for authenticate API calls)
VERISOUL_API_KEY=your-api-key-here
```

3. If you don't have a Verisoul Project ID or API key, schedule a call [here](https://meetings.hubspot.com/henry-legard) to get started.

## Get Started

### Install Dependencies

From the `example` directory:

```sh
npm install
# OR
yarn install
```

### Run on Android or iOS

#### Android

1. Start an Android emulator or connect a physical device
2. Run the app:

```sh
npm run android
# OR
yarn android
```

#### iOS

1. **First time only** - Install CocoaPods dependencies:

```sh
cd ios
pod install
cd ..
```

2. Run the app:

```sh
npm run ios
# OR
yarn ios
```

> **Note:** To run on a physical iOS device, open `ios/VerisoulReactnativeExample.xcworkspace` in Xcode and select your device.

## Troubleshooting

**Android:** If build fails, clean the project:
```sh
cd android && ./gradlew clean && cd ..
```

**iOS:** If build fails, reinstall pods:
```sh
cd ios && pod install && cd ..
```

**Metro:** Reset cache if needed:
```sh
npx react-native start --reset-cache
```
