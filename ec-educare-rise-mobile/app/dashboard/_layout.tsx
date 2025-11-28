import { Tabs } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return (
        <Tabs
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={clearAuth} className="mr-4">
                        <Text className="text-blue-600 dark:text-blue-400 font-bold">Logout</Text>
                    </TouchableOpacity>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            {/* Add other tabs if needed, or just rely on index for now */}
        </Tabs>
    );
}
