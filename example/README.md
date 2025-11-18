# Verisoul React Native Sample App

This example app demonstrates how to integrate the Verisoul SDK into a React Native application.

## Requirements

- React Native development environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))
- Node.js and npm or Yarn
- **iOS**: Xcode and CocoaPods
- **Android**: Android Studio and Android SDK

## Configure

Before running the sample app, you need to configure it with your Verisoul credentials.

1. Open `src/App.tsx` in your text editor

2. Update the Verisoul configuration with your credentials:

```js
Verisoul.configure({
  environment: VerisoulEnvironment.sandbox, // Change to .prod for production
  projectId: 'YOUR_PROJECT_ID', // Replace with your actual project ID
});
```

3. If you don't have a Verisoul Project ID, schedule a call [here](https://meetings.hubspot.com/henry-legard) to get started.

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

## Learn More

- [Verisoul Documentation](https://docs.verisoul.ai/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Verisoul React Native SDK](https://github.com/verisoul/react-native-sdk)
