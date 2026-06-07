/**
 * @format
 */

import { AppRegistry } from 'react-native';

import App from '@/App';
import { applyE2EBootstrapFromLaunchArgs } from '@/testing/e2eBootstrap';

import { name as appName } from './app.json';

import '@/setup/reanimatedLogger';
import 'react-native-gesture-handler';

applyE2EBootstrapFromLaunchArgs();

AppRegistry.registerComponent(appName, () => App);
