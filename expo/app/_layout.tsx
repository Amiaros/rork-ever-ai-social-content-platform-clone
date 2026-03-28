import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, LogBox } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { MatrixBackground } from '@/components/MatrixBackground';
import { FontProvider } from '@/components/FontProvider';

// Ignore specific warnings that might appear on Android
LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'ColorPropType will be removed from React Native',
  'Animated: `useNativeDriver` was not specified',
  'NativeEventEmitter',
  'Require cycle:',
  'Possible Unhandled Promise Rejection',
]);

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setFont } = useThemeStore();

  // Simplified font loading
  useEffect(() => {
    async function prepare() {
      try {
        // Load only FontAwesome icons which are essential
        await FontAwesome.loadFont();
        
        // Set default font to system
        setFont('system');
        
        console.log('App initialization complete');
      } catch (error) {
        console.warn('Font loading error:', error);
        // Continue with system font
        setFont('system');
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [setFont]);

  // Show a blank view while app is preparing
  if (!appIsReady) {
    return null;
  }

  return (
    <FontProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <MatrixBackground />
        <Slot />
      </View>
    </FontProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});