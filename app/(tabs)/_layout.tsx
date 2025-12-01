import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function DashboardLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4F46E5', // Primary indigo
                tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
                tabBarStyle: {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#374151' : '#E5E7EB',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="classes"
                options={{
                    title: 'Classes',
                    tabBarLabel: 'Classes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar/index"
                options={{
                    title: 'Calendar',
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="directory/index"
                options={{
                    title: 'Directory',
                    tabBarLabel: 'Directory',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
}
