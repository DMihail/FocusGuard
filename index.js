/**
 * @format
 */

require('@/setup/reanimatedLogger');
require('react-native-gesture-handler');

const { AppRegistry, Platform } = require('react-native');

const { bootstrapCrashlytics } = require('@/crashlytics/bootstrapCrashlytics');
bootstrapCrashlytics();

if (Platform.OS === 'android') {
  const { bootstrapNativeUsageEvents } = require('@/specs/nativeUsageStatsApi.android');
  bootstrapNativeUsageEvents();
}

if (Platform.OS === 'ios') {
  const { bootstrapNativeUsageEvents } = require('@/specs/nativeUsageStatsApi.ios');
  bootstrapNativeUsageEvents();
}

const App = require('@/App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);
