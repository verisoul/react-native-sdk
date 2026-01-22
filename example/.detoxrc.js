/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 300000,
      testTimeout: 240000
    }
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug'
    },
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/VerisoulReactnativeExample.app',
      build: 'xcodebuild -workspace ios/VerisoulReactnativeExample.xcworkspace -scheme VerisoulReactnativeExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    }
  },
  devices: {
    'android.emulator': {
      type: 'android.emulator',
      device: {
        avdName: 'test'
      },
      bootArgs: '-wipe-data -no-snapshot -no-boot-anim',
      startupDelay: 60
    },
    'android.emulator.local': {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86_local'
      },
      bootArgs: '-wipe-data -no-snapshot'
    },
    'android.attached': {
      type: 'android.attached',
      device: {
        adbName: 'emulator-5554'
      }
    },
    'ios.simulator': {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    }
  },
  configurations: {
    'android.emu.debug': {
      device: 'android.emulator',
      app: 'android.debug',
      behavior: {
        init: {
          reinstallApp: true,
          deleteTranslogs: true
        }
      }
    },
    'android.emu.local': {
      device: 'android.emulator.local',
      app: 'android.debug',
      behavior: {
        init: {
          reinstallApp: true,
          deleteTranslogs: true
        }
      }
    },
    'android.att.debug': {
      device: 'android.attached',
      app: 'android.debug',
      behavior: {
        init: {
          reinstallApp: false
        }
      }
    },
    'ios.sim.debug': {
      device: 'ios.simulator',
      app: 'ios.debug'
    }
  },
  behavior: {
    init: {
      reinstallApp: true,
      keepLockFile: false
    },
    launchApp: 'auto'
  }
};
