/**
 * @format
 */

require('@/setup/reanimatedLogger');
require('react-native-gesture-handler');

const { AppRegistry, Platform } = require('react-native');

const { bootstrapCrashlytics } = require('@/crashlytics/bootstrapCrashlytics');
bootstrapCrashlytics();

if (Platform.OS === 'android') {
  const { bootstrapKeeptTurboModuleEvents } = require('@/specs/keeptTurboModuleApi.android');
  bootstrapKeeptTurboModuleEvents();
}

if (Platform.OS === 'ios') {
  const { bootstrapKeeptTurboModuleEvents } = require('@/specs/keeptTurboModuleApi.ios');
  bootstrapKeeptTurboModuleEvents();
}

const App = require('@/App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);
