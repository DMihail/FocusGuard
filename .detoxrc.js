/** @type {Detox.DetoxConfig} */

/** Override with DETOX_AVD_NAME if your local AVD differs (see `emulator -list-avds`). */
const androidAvdName = process.env.DETOX_AVD_NAME ?? 'Medium_Phone';

module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/FocusGuard.app',
      build:
        'xcodebuild -workspace ios/FocusGuard.xcworkspace -scheme FocusGuard -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/FocusGuard.app',
      build:
        'xcodebuild -workspace ios/FocusGuard.xcworkspace -scheme FocusGuard -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
    'android.e2eRelease': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/e2eRelease/app-e2eRelease.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/e2eRelease/app-e2eRelease-androidTest.apk',
      build: 'cd android && ./gradlew assembleE2eRelease assembleAndroidTest -DtestBuildType=e2eRelease',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: androidAvdName,
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.att.e2eRelease': {
      device: 'attached',
      app: 'android.e2eRelease',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.emu.e2eRelease': {
      device: 'emulator',
      app: 'android.e2eRelease',
    },
  },
  behavior: {
    init: {
      exposeGlobals: false,
    },
  },
};
