/**
 * @format
 */

require('@/setup/reanimatedLogger');
require('react-native-gesture-handler');

const { AppRegistry, Platform } = require('react-native');

const { bootstrapCrashlytics } = require('@/crashlytics/bootstrapCrashlytics');
bootstrapCrashlytics();

if (Platform.OS === 'android') {
  const { bootstrapPermissionsChangedEvents } = require('@/specs/nativeUsageStatsApi.android');
  bootstrapPermissionsChangedEvents();
}

const App = require('@/App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);
