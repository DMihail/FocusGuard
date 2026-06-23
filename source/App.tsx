/** @format */

import { StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';

import { Navigation } from './navigation';

import { SystemChrome } from '@/components';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <GestureHandlerRootView style={styles.root}>
            <SystemChrome />
            <Navigation />
          </GestureHandlerRootView>
        </I18nProvider>
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
