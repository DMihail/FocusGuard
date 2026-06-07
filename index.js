/**
 * @format
 *
 * Entry order matters: E2E bootstrap must run before `@/App` loads Zustand stores.
 * Static `import` is hoisted, so App is loaded via `require()` after bootstrap.
 */

require('@/setup/reanimatedLogger');
require('react-native-gesture-handler');

const { AppRegistry } = require('react-native');
const { applyE2EBootstrapFromLaunchArgs } = require('@/testing/e2eBootstrap');
const { name: appName } = require('./app.json');

applyE2EBootstrapFromLaunchArgs();

const App = require('@/App').default;

AppRegistry.registerComponent(appName, () => App);
