import { NetworkStatus } from '@/components/NetworkStatus';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import '../global.css';
import { store } from '../store';
import { useAuthStore } from '../store/auth.store';

import { AlertProvider } from '@/context/AlertContext';

// Suppress SafeAreaView deprecation warning from dependencies until they update
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

function RootLayoutNav() {
  const { isAuthenticated, isHydrated, setHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Fallback: If hydration takes too long, force it to finish
    const hydrationTimeout = setTimeout(() => {
      if (!isHydrated) {
        console.warn('Hydration timed out, forcing hydration completion');
        setHydrated();
      }
    }, 2000);

    if (!isHydrated || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated) {
      // If authenticated and in auth group OR at root, go to dashboard
      if (inAuthGroup || !segments[0]) {
        console.log('Redirecting to dashboard');
        setTimeout(() => router.replace('/(tabs)'), 0);
      }
    } else if (!isAuthenticated && segments[0] !== 'auth') {
      console.log('Redirecting to login');
      setTimeout(() => router.replace('/auth/login'), 0);
    }

    return () => clearTimeout(hydrationTimeout);
  }, [isAuthenticated, segments, rootNavigationState, isHydrated]);

  // Wait for navigation state to be ready (prevents dev-only navigation errors)
  if (!rootNavigationState?.key) {
    return null;
  }

  // We must render the Stack immediately to ensure navigation is mounted.
  // The useEffect will handle redirection once hydration is complete.
  // While hydrating, the user will see the initial route (likely index.tsx which is a spinner).

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ title: 'Authenticating...' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="class" options={{ headerShown: false }} />
      <Stack.Screen name="student" options={{ headerShown: false }} />
      <Stack.Screen name="teacher" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AlertProvider>
        <NetworkStatus />
        <RootLayoutNav />
      </AlertProvider>
    </Provider>
  );
}
