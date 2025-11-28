import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AuthCallback() {
    const params = useLocalSearchParams();

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-gray-600">Completing sign in...</Text>
            {/* 
         In a real scenario with manual redirect handling, 
         we would parse `params.code` here and call `exchangeCodeForToken`.
         But since we use `useAuthRequest` in Login screen, this screen might not be reached
         unless we explicitly navigate here or configure the redirect URI to point here.
         If we do reach here, we should probably just let the user know to close the window 
         or handle the exchange if `useAuthRequest` failed to catch it.
      */}
        </View>
    );
}
