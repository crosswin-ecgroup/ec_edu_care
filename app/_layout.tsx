import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { store } from '../store';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import '../global.css';

function RootLayoutNav() {
  const { isAuthenticated, isHydrated, setHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    console.log('RootLayoutNav state:', { isHydrated, isAuthenticated, segments: segments[0], navKey: rootNavigationState?.key });

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
        setTimeout(() => router.replace('/dashboard'), 0);
      }
    } else if (!isAuthenticated && segments[0] !== 'auth') {
      console.log('Redirecting to login');
      setTimeout(() => router.replace('/auth/login'), 0);
    }

    return () => clearTimeout(hydrationTimeout);
  }, [isAuthenticated, segments, rootNavigationState, isHydrated]);

  // We must render the Stack immediately to ensure navigation is mounted.
  // The useEffect will handle redirection once hydration is complete.
  // While hydrating, the user will see the initial route (likely index.tsx which is a spinner).

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ title: 'Authenticating...' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
