/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Platform, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import {
  checkForPermission,
  checkForQueryAllPackagesPermission,
  getAppsUsageStats,
  getInstalledApplications,
  requestUsageStatsPermission,
} from './specs';
import { Navigation } from './navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log(checkForQueryAllPackagesPermission());
    console.log(checkForPermission());
    console.log(getInstalledApplications());
    if (checkForPermission())
      console.log(
        getAppsUsageStats().map(
          (app) =>
            `${app.appName}, ${app.packageName}, ${(app.totalTimeForeground / 60000).toFixed(2)}, ${app.lastTimeUsed}`,
        ),
      );
    if (Platform.OS === 'android') {
      requestUsageStatsPermission();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
