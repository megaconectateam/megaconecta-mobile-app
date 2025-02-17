import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, StatusBar } from 'react-native';
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Root } from './src/navigation';
import { AuthProvider } from './src/providers/AuthProvider';
import { LoadingProvider } from './src/providers/LoadingProvider';
import { MegaQueryProvider } from './src/providers/MegaQueryProvider';
import { GlobalModal } from './src/providers/ModalProvider';
import { TopupProvider } from './src/providers/TopupProvider';
import { store } from './src/store/store';
import './src/utils/initI18n';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'TRenderEngineProvider',
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Navigate() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Inter-Black': require('./src/assets/fonts/Inter-Black.ttf'),
          'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
          'Inter-ExtraBold': require('./src/assets/fonts/Inter-ExtraBold.ttf'),
          'Inter-ExtraLight': require('./src/assets/fonts/Inter-ExtraLight.ttf'),
          'Inter-Light': require('./src/assets/fonts/Inter-Light.ttf'),
          'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
          'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
          'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Thin': require('./src/assets/fonts/Inter-Thin.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();

    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

    // Also need enable notifications to complete OneSignal setup
    OneSignal.Notifications.requestPermission(true);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Root />
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LoadingProvider>
        <MegaQueryProvider>
          <Provider store={store}>
            <AuthProvider>
              <GlobalModal>
                <TopupProvider>
                  <Navigate />
                </TopupProvider>
              </GlobalModal>
            </AuthProvider>
          </Provider>
        </MegaQueryProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
}
