/** @format */

import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ensureAndroidLayoutAnimationEnabled } from '@/utils/layoutAnimation';

import { Navigation } from './navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    ensureAndroidLayoutAnimationEnabled();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
