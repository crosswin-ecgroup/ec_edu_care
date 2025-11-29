import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => router.push('/dashboard/profile')}
                        className="mr-4"
                    >
                        <Ionicons name="person-circle-outline" size={32} color="#3B82F6" />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="directory"
                options={{
                    title: 'Directory',
                    tabBarLabel: 'Directory',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="class-details"
                options={{
                    title: 'Class Details',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="create-class"
                options={{
                    title: 'Create Class',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
