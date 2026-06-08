/**
 * @format
 */

require('@/setup/reanimatedLogger');
require('react-native-gesture-handler');

const { AppRegistry } = require('react-native');
const App = require('@/App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);
