/** @format */

import { StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageSync } from '@/i18n';
import { ThemeProvider } from '@/theme';

import { RootNavigationGate } from './navigation/RootNavigationGate';

import { SystemChrome } from '@/components';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageSync>
          <GestureHandlerRootView style={styles.root}>
            <SystemChrome />
            <RootNavigationGate />
          </GestureHandlerRootView>
        </LanguageSync>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
