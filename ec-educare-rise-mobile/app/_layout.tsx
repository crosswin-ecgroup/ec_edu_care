import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useRouter, useSegments } from 'expo-router';
import '../global.css';

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/dashboard');
    } else if (!isAuthenticated && segments[0] !== 'auth') {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, segments]);

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
